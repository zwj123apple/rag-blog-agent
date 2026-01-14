"""
RAG核心服务
封装所有RAG相关逻辑
"""
import time
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from anthropic import Anthropic
from ..config import settings
from ..models import RetrievedDocument, DocumentMetadata

class RAGServiceBak:
    def __init__(self):
        """初始化RAG服务"""
        # 初始化Embedding模型
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        # 初始化文本分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", "。", "！", "？", "；", "，", " "]
        )
        
        # 初始化向量数据库
        self.vectorstore = self._init_vectorstore()
        
        # 初始化AI客户端
        if settings.ANTHROPIC_API_KEY:
            self.ai_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        else:
            self.ai_client = None
        
        # 文档元数据存储
        self.documents_metadata = {}
    
    def _init_vectorstore(self):
        """初始化或加载向量数据库"""
        return Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIR,
            embedding_function=self.embeddings
        )
    
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
        
        return len(documents)
    
    def retrieve_documents(self, query: str, top_k: int = 3) -> List[RetrievedDocument]:
        """检索相关文档"""
        results = self.vectorstore.similarity_search_with_score(query, k=top_k)
        
        retrieved_docs = []
        for doc, score in results:
            retrieved_docs.append(RetrievedDocument(
                content=doc.page_content,
                score=float(score),
                metadata=DocumentMetadata(**doc.metadata)
            ))
        
        return retrieved_docs
    
    def generate_answer(self, query: str, retrieved_docs: List[RetrievedDocument]) -> str:
        """生成答案"""
        if not self.ai_client or not retrieved_docs:
            return self._fallback_response(query, retrieved_docs)
        
        # 构建上下文
        context = "\n\n".join([
            f"[文档{i+1}] {doc.content}"
            for i, doc in enumerate(retrieved_docs)
        ])
        
        # 构建prompt
        prompt = f"""基于以下参考资料回答问题。

参考资料：
{context}

问题：{query}

要求：
1. 仅基于参考资料回答
2. 如果资料中没有相关信息，明确说明
3. 回答要准确、简洁

回答："""
        
        try:
            message = self.ai_client.messages.create(
                model=settings.AI_MODEL,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except Exception as e:
            return self._fallback_response(query, retrieved_docs, str(e))
    
    def _fallback_response(self, query: str, docs: List[RetrievedDocument], error: str = None) -> str:
        """备用响应"""
        if error:
            return f"AI生成失败: {error}\n\n检索到的内容：\n{docs[0].content if docs else '无'}"
        if not docs:
            return "抱歉，未找到相关信息。请上传更多文档。"
        return f"检索到以下相关内容：\n\n{docs[0].content}"
    
    def query(self, question: str, top_k: int = 3) -> Dict:
        """完整查询流程"""
        start_time = time.time()
        
        # 检索
        retrieved_docs = self.retrieve_documents(question, top_k)
        
        # 生成答案
        answer = self.generate_answer(question, retrieved_docs)
        
        return {
            "question": question,
            "answer": answer,
            "retrieved_docs": retrieved_docs,
            "processing_time": time.time() - start_time,
            "model_used": settings.AI_MODEL
        }