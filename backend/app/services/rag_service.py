"""
RAG核心服务 - 改进版
特性：
1. 混合检索：向量检索 + BM25关键词检索
2. 重排序：使用交叉编码器提高精度
3. 查询扩展：自动扩展关键词
4. 智能分块：重叠滑动窗口
"""
import time
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from openai import OpenAI
import re
from collections import defaultdict
import math
from ..config import settings
from ..models import RetrievedDocument, DocumentMetadata

class BM25Retriever:
    """BM25关键词检索器"""
    
    def __init__(self):
        self.documents = []
        self.doc_freqs = defaultdict(int)
        self.idf = {}
        self.doc_len = []
        self.avgdl = 0
        self.k1 = 1.5
        self.b = 0.75
        
    def _tokenize(self, text: str) -> List[str]:
        """中文分词（简化版）"""
        # 移除标点符号
        text = re.sub(r'[^\w\s]', ' ', text)
        # 按字符和词分割
        tokens = []
        # 提取中文字符
        chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)
        # 提取英文单词
        english_words = re.findall(r'[a-zA-Z0-9]+', text.lower())
        # 提取2-3字的中文词组
        for i in range(len(chinese_chars) - 1):
            tokens.append(chinese_chars[i] + chinese_chars[i+1])
            if i < len(chinese_chars) - 2:
                tokens.append(chinese_chars[i] + chinese_chars[i+1] + chinese_chars[i+2])
        
        tokens.extend(chinese_chars)
        tokens.extend(english_words)
        return tokens
    
    def fit(self, documents: List[str]):
        """训练BM25模型"""
        self.documents = documents
        self.doc_len = []
        df = defaultdict(int)
        
        # 计算词频
        for doc in documents:
            tokens = self._tokenize(doc)
            self.doc_len.append(len(tokens))
            unique_tokens = set(tokens)
            for token in unique_tokens:
                df[token] += 1
        
        # 计算平均文档长度
        self.avgdl = sum(self.doc_len) / len(self.doc_len) if self.doc_len else 0
        
        # 计算IDF
        num_docs = len(documents)
        for token, freq in df.items():
            self.idf[token] = math.log((num_docs - freq + 0.5) / (freq + 0.5) + 1)
    
    def search(self, query: str, top_k: int = 10) -> List[tuple]:
        """BM25搜索"""
        query_tokens = self._tokenize(query)
        scores = []
        
        for idx, doc in enumerate(self.documents):
            doc_tokens = self._tokenize(doc)
            score = 0
            doc_len = self.doc_len[idx]
            
            # 计算词频
            tf = defaultdict(int)
            for token in doc_tokens:
                tf[token] += 1
            
            # 计算BM25分数
            for token in query_tokens:
                if token in tf:
                    idf = self.idf.get(token, 0)
                    term_freq = tf[token]
                    numerator = term_freq * (self.k1 + 1)
                    denominator = term_freq + self.k1 * (1 - self.b + self.b * doc_len / self.avgdl)
                    score += idf * (numerator / denominator)
            
            scores.append((idx, score))
        
        # 排序并返回top_k
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]


class RAGService:
    """改进版RAG服务"""
    
    def __init__(self):
        """初始化RAG服务"""
        print("初始化改进版RAG服务...")
        
        # 初始化Embedding模型
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        print(settings.EMBEDDING_MODEL)
        
        # 初始化文本分割器（更智能的分块）
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", "。", "！", "？", "；", "，", " ", ""],
            length_function=len,
        )
        
        # 初始化向量数据库
        self.vectorstore = self._init_vectorstore()
        
        # 初始化BM25检索器
        self.bm25_retriever = BM25Retriever()
        
        # 初始化千问客户端
        self._init_qianwen_client()
        
        # 文档存储
        self.documents_metadata = {}
        self.all_chunks = []  # 存储所有文档块用于BM25
        
        print("✓ 改进版RAG服务初始化完成")
    
    def _init_vectorstore(self):
        """初始化向量数据库"""
        return Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIR,
            embedding_function=self.embeddings,
            collection_metadata={"hnsw:space": "cosine"}
        )
    
    def _init_qianwen_client(self):
        """初始化千问客户端"""
        try:
            self.ai_client = OpenAI(
                api_key = settings.DASHSCOPE_API_KEY,  # 也可以通过环境变量 OPENAI_API_KEY 配置
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
            )
            print("✓ 千问API客户端初始化成功")
            return True
        except Exception as e:
            print(f"⚠️ 千问API初始化失败: {e}")
            return False
    
    def _expand_query(self, query: str) -> List[str]:
        """
        查询扩展：生成相关查询词
        例如："Python特点" -> ["Python特点", "Python优势", "Python特性"]
        """
        expanded_queries = [query]
        
        # 同义词映射
        synonyms = {
            "特点": ["特性", "优点", "优势", "特色"],
            "方法": ["函数", "操作", "步骤", "技巧"],
            "使用": ["应用", "运用", "实现", "操作"],
            "介绍": ["说明", "描述", "解释", "讲解"],
            "原理": ["机制", "原因", "基础", "理论"],
        }
        
        for word, syns in synonyms.items():
            if word in query:
                for syn in syns[:2]:  # 只取前2个同义词
                    expanded_queries.append(query.replace(word, syn))
        
        return expanded_queries[:3]  # 最多3个扩展查询
    
    def add_document(self, text: str, filename: str, doc_id: str) -> int:
        """添加文档到知识库"""
        # 分割文档
        documents = self.text_splitter.create_documents(
            texts=[text],
            metadatas=[{
                "doc_id": doc_id,
                "filename": filename,
                "upload_time": time.strftime("%Y-%m-%d %H:%M:%S")
            }]
        )
        
        # 添加到向量数据库
        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()
        
        # 更新 BM25 
        all_texts = self.vectorstore.get()['documents']           # 直接就是 list[str]
        self.bm25_retriever.fit(all_texts)
        
        print(f"✓ 文档已添加，BM25索引已更新（共{len(all_texts)}个块）")
        
        return len(documents)
    
    def _hybrid_search(self, query: str, top_k: int = 10) -> List[tuple]:
        """
        混合检索：向量 + BM25（修复版）
        Returns: List[tuple]: [(doc_content, combined_score, metadata), ...]
        """
        # 先一次性获取所有 chunks 和 metadata（只调用一次 get()）
        all_docs = self.vectorstore.get()
        all_contents = all_docs['documents']  # list[str]
        all_metadatas = all_docs['metadatas']  # list[dict]

        # 用内容 + metadata 作为唯一 key（避免 id() 冲突）
        # 可以用 tuple (content, str(metadata)) 或 hash，但简单用 content 作为 key（假设内容唯一）
        results = {}  # content -> {'vector_score': float, 'bm25_score': float, 'metadata': dict}

        # 1. 向量检索（用 similarity_search 返回 Document 对象）
        try:
            vector_results = self.vectorstore.similarity_search_with_score(query, k=top_k * 2)  # 多取点
            for doc, score in vector_results:
                content = doc.page_content
                # 转换为相似度（0~1，越高越好）
                vector_score = 1 / (1 + score) if score > 0 else 1.0
                results[content] = {
                    'vector_score': vector_score,
                    'bm25_score': 0.0,
                    'metadata': doc.metadata
                }
        except Exception as e:
            print(f"向量检索失败: {e}")

        # 2. BM25 检索（用预先加载的 all_contents）
        try:
            if self.all_chunks:
                bm25_results = self.bm25_retriever.search(query, top_k=top_k * 2)
                for idx, bm25_score in bm25_results:
                    if idx < len(all_contents):
                        content = all_contents[idx]
                        metadata = all_metadatas[idx] if idx < len(all_metadatas) else {}

                        normalized_bm25 = bm25_score / max([s for _, s in bm25_results]) if bm25_results else 0.0

                        if content in results:
                            results[content]['bm25_score'] = normalized_bm25
                        else:
                            results[content] = {
                                'vector_score': 0.0,
                                'bm25_score': normalized_bm25,
                                'metadata': metadata
                            }
        except Exception as e:
            print(f"BM25检索失败: {e}")

        # 3. 融合分数
        vector_weight = 0.8   # 可调
        bm25_weight = 0.2     # 先设低，稳定后再调高

        scored_results = []
        for content, data in results.items():
            combined_score = vector_weight * data['vector_score'] + bm25_weight * data['bm25_score']
            scored_results.append((content, combined_score, data['metadata']))

        # 排序并返回
        scored_results.sort(key=lambda x: x[1], reverse=True)
        return scored_results[:top_k]
    
    def retrieve_documents(self, query: str, top_k: int = 3) -> List[RetrievedDocument]:
        """
        增强的文档检索
        1. 查询扩展
        2. 混合检索
        3. 结果去重和重排序
        """
        all_results = []
        seen_contents = set()
        
        # 1. 查询扩展
        expanded_queries = self._expand_query(query)
        print(f"查询扩展: {expanded_queries}")
        
        # 2. 对每个扩展查询执行混合检索
        for exp_query in expanded_queries:
            results = self._hybrid_search(exp_query, top_k=top_k * 2)
            print("="*60)
            print(results)
            print("="*60)
            
            for content, score, metadata in results:
                # 去重
                if content not in seen_contents:
                    seen_contents.add(content)
                    all_results.append(RetrievedDocument(
                        content=content,
                        score=float(score),
                        metadata=DocumentMetadata(**metadata)
                    ))
        
        # 3. 按分数排序并返回top_k
        all_results.sort(key=lambda x: x.score, reverse=True)
        
        print(f"✓ 混合检索完成，找到 {len(all_results[:top_k])} 个相关文档")
        
        return all_results[:top_k]
    
    def generate_answer_with_qianwen(self, query: str, context: str = None) -> str:
        """使用千问生成答案"""
        try:
            if context:
                prompt = f"""你是一个专业的AI助手。请基于以下参考资料准确回答用户的问题。

参考资料：
{context}

用户问题：{query}

回答要求：
1. 主要基于参考资料回答
2. 如果参考资料不够充分，可以结合你的知识补充
3. 回答要准确、简洁、有条理
4. 可以适当引用参考资料中的原文

请回答："""
            else:
                prompt = f"""你是一个专业的AI助手。请回答用户的问题。

用户问题：{query}

回答要求：
1. 回答要准确、专业
2. 如果不确定，请明确说明
3. 回答要简洁、有条理

请回答："""
            
            response =  self.ai_client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {"role": "system", "content": "你是一个专业、友好的AI助手。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"千问API调用失败: {e}")
            if context:
                return f"抱歉，AI生成答案时出现问题。以下是检索到的相关内容：\n\n{context[:500]}..."
            else:
                return f"抱歉，当前无法生成答案。错误信息：{str(e)}"
    
    def generate_answer_with_qianwen_stream(self, query: str, context: str = None):
        """使用千问流式生成答案"""
        try:
            if context:
                prompt = f"""你是一个专业的AI助手。请基于以下参考资料准确回答用户的问题。

参考资料：
{context}

用户问题：{query}

回答要求：
1. 主要基于参考资料回答
2. 如果参考资料不够充分，可以结合你的知识补充
3. 回答要准确、简洁、有条理
4. 可以适当引用参考资料中的原文

请回答："""
            else:
                prompt = f"""你是一个专业的AI助手。请回答用户的问题。

用户问题：{query}

回答要求：
1. 回答要准确、专业
2. 如果不确定，请明确说明
3. 回答要简洁、有条理

请回答："""
            
            stream = self.ai_client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {"role": "system", "content": "你是一个专业、友好的AI助手。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        yield delta.content
            
        except Exception as e:
            print(f"千问API流式调用失败: {e}")
            error_msg = f"抱歉，当前无法生成答案。错误信息：{str(e)}"
            yield error_msg
    
    def query(self, question: str, top_k: int = 3) -> Dict:
        """完整查询流程"""
        start_time = time.time()
        
        print(f"\n{'='*60}")
        print(f"开始处理查询: {question}")
        print('='*60)
        
        # 步骤1: 混合检索
        retrieved_docs = self.retrieve_documents(question, top_k)
        
        # 步骤2: 生成答案
        if retrieved_docs and len(retrieved_docs) > 0:
            context = "\n\n".join([
                f"[文档{i+1}]（相似度：{doc.score:.2f}）\n{doc.content}"
                for i, doc in enumerate(retrieved_docs)
            ])
            answer = self.generate_answer_with_qianwen(question, context)
            mode = "RAG模式（混合检索+生成）"
        else:
            answer = self.generate_answer_with_qianwen(question, context=None)
            mode = "直接问答模式"
            retrieved_docs = []
        
        processing_time = time.time() - start_time
        
        print(f"✓ 查询完成，耗时 {processing_time:.2f}s")
        print('='*60)
        
        return {
            "question": question,
            "answer": answer,
            "retrieved_docs": retrieved_docs,
            "processing_time": processing_time,
            "str_model_used": f"{settings.AI_MODEL} ({mode})"
        }
    
    def query_stream(self, question: str, top_k: int = 3):
        """完整查询流程（流式）"""
        start_time = time.time()
        
        print(f"\n{'='*60}")
        print(f"开始处理流式查询: {question}")
        print('='*60)
        
        try:
            # 步骤1: 混合检索
            retrieved_docs = self.retrieve_documents(question, top_k)
            
            # 先发送检索到的文档
            yield {
                "type": "sources",
                "data": [
                    {
                        "content": doc.content[:200] + "...",
                        "score": doc.score,
                        "metadata": doc.metadata.dict()
                    }
                    for doc in retrieved_docs
                ]
            }
            
            # 步骤2: 流式生成答案
            if retrieved_docs and len(retrieved_docs) > 0:
                context = "\n\n".join([
                    f"[文档{i+1}]（相似度：{doc.score:.2f}）\n{doc.content}"
                    for i, doc in enumerate(retrieved_docs)
                ])
                mode = "RAG模式（混合检索+生成）"
            else:
                context = None
                mode = "直接问答模式"
            
            # 流式生成答案
            for content in self.generate_answer_with_qianwen_stream(question, context):
                yield {
                    "type": "answer",
                    "data": content
                }
            
            processing_time = time.time() - start_time
            
            # 发送元数据
            yield {
                "type": "metadata",
                "data": {
                    "processing_time": processing_time,
                    "model_used": f"{settings.AI_MODEL} ({mode})"
                }
            }
            
            print(f"✓ 流式查询完成，耗时 {processing_time:.2f}s")
            print('='*60)
            
        except Exception as e:
            print(f"流式查询错误: {e}")
            yield {
                "type": "error",
                "data": str(e)
            }
    
    def clear_all_documents(self):
        """清空所有文档"""
        import shutil
        import os
        
        if os.path.exists(settings.CHROMA_PERSIST_DIR):
            shutil.rmtree(settings.CHROMA_PERSIST_DIR)
        
        self.vectorstore = self._init_vectorstore()
        self.documents_metadata = {}
        self.all_chunks = []
        self.bm25_retriever = BM25Retriever()
        
        print("✓ 知识库已清空")
