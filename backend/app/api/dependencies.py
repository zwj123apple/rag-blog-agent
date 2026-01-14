# ============================================================
# backend/app/api/dependencies.py
# ============================================================
"""
依赖注入
"""
from fastapi import Depends, HTTPException, Header
from typing import Optional
from ..services.rag_service import RAGService
from ..services.document_service import DocumentService
from ..config import settings

# 服务单例
_rag_service = None
_doc_service = None

def get_rag_service() -> RAGService:
    """获取RAG服务实例"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service

def get_document_service() -> DocumentService:
    """获取文档服务实例"""
    global _doc_service
    if _doc_service is None:
        _doc_service = DocumentService()
    return _doc_service

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """
    验证API密钥（可选功能）
    """
    # 如果配置了API密钥验证
    if hasattr(settings, 'REQUIRE_API_KEY') and settings.REQUIRE_API_KEY:
        if not x_api_key or x_api_key != settings.API_KEY:
            raise HTTPException(status_code=401, detail="无效的API密钥")
    return x_api_key