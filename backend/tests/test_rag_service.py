# ============================================================
# backend/tests/test_rag_service.py
# ============================================================
"""
RAG服务测试
"""
import pytest
from app.services.rag_service import RAGService

@pytest.fixture
def rag_service():
    """RAG服务fixture"""
    return RAGService()

def test_rag_service_initialization(rag_service):
    """测试RAG服务初始化"""
    assert rag_service is not None
    assert rag_service.embeddings is not None
    assert rag_service.vectorstore is not None

def test_add_document(rag_service):
    """测试添加文档"""
    text = "这是一个测试文档。它包含了一些测试内容。"
    doc_id = "test_doc_1"
    filename = "test.txt"
    
    chunk_count = rag_service.add_document(text, filename, doc_id)
    assert chunk_count > 0

def test_retrieve_documents(rag_service):
    """测试文档检索"""
    # 先添加文档
    text = "Python是一门编程语言。它简单易学。"
    rag_service.add_document(text, "test.txt", "doc1")
    
    # 检索
    results = rag_service.retrieve_documents("Python编程", top_k=1)
    assert len(results) > 0
    assert results[0].score > 0