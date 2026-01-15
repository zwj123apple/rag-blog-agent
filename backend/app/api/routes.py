"""
API路由定义
所有HTTP端点
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List
import uuid
import time
import json
from app.models import *
from app.services.rag_service import RAGService
from app.services.document_service import DocumentService
from app.config import settings

router = APIRouter()

# 服务实例（实际应用中使用依赖注入）
rag_service = RAGService()
doc_service = DocumentService()

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """健康检查"""
    return HealthCheck(
        status="healthy",
        version=settings.VERSION,
        embedding_model=settings.EMBEDDING_MODEL,
        ai_configured=bool(settings.ANTHROPIC_API_KEY),
        documents_count=len(rag_service.documents_metadata)
    )

@router.post("/upload", response_model=DocumentInfo)
async def upload_document(file: UploadFile = File(...)):
    """上传文档"""
    # 验证文件
    doc_service.validate_file(file.filename, file.size)
    
    # 读取并处理文件
    content = await file.read()
    text = doc_service.extract_text(content, file.filename)
    
    # 生成文档ID
    doc_id = str(uuid.uuid4())
    
    # 添加到RAG系统
    chunk_count = rag_service.add_document(text, file.filename, doc_id)
    
    # 保存元数据
    doc_info = DocumentInfo(
        id=doc_id,
        filename=file.filename,
        file_size=len(content),
        upload_time=time.strftime("%Y-%m-%d %H:%M:%S"),
        chunk_count=chunk_count,
        status="success"
    )
    rag_service.documents_metadata[doc_id] = doc_info
    
    return doc_info

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """查询知识库（支持对话历史）"""
    # 转换对话历史格式
    chat_history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history] if request.chat_history else []
    result = rag_service.query(request.question, request.top_k, chat_history=chat_history)
    return QueryResponse(**result)

@router.post("/query/stream")
async def query_documents_stream(request: QueryRequest):
    """流式查询知识库（支持对话历史）"""
    def generate():
        try:
            # 转换对话历史格式
            chat_history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history] if request.chat_history else []
            for chunk in rag_service.query_stream(request.question, request.top_k, chat_history=chat_history):
                # 使用 Server-Sent Events 格式
                yield f" {json.dumps(chunk, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f" {json.dumps({'type': 'error', 'data': str(e)}, ensure_ascii=False)}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/documents", response_model=List[DocumentInfo])
async def list_documents():
    """获取文档列表"""
    return list(rag_service.documents_metadata.values())

@router.delete("/documents")
async def clear_documents():
    """清空所有文档"""
    rag_service.clear_all_documents()
    return {"message": "所有文档已清空"}

@router.get("/stats", response_model=SystemStats)
async def get_stats():
    """获取系统统计"""
    docs = list(rag_service.documents_metadata.values())
    return SystemStats(
        total_documents=len(docs),
        total_chunks=sum(d.chunk_count for d in docs),
        embedding_model=settings.EMBEDDING_MODEL,
        ai_model=settings.AI_MODEL,
        vector_db_path=settings.CHROMA_PERSIST_DIR
    )
