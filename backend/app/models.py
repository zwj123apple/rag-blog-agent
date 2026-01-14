"""
数据模型定义
使用Pydantic进行数据验证
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    """查询请求模型"""
    question: str = Field(..., min_length=1, description="用户问题")
    top_k: Optional[int] = Field(3, ge=1, le=10, description="返回文档数量")
    include_sources: bool = Field(True, description="是否包含来源信息")

class DocumentMetadata(BaseModel):
    """文档元数据"""
    filename: str
    doc_id: str
    upload_time: str
    chunk_index: Optional[int] = None

class RetrievedDocument(BaseModel):
    """检索到的文档"""
    content: str
    score: float
    metadata: DocumentMetadata

class QueryResponse(BaseModel):
    """查询响应模型"""
    question: str
    answer: str
    retrieved_docs: List[RetrievedDocument]
    processing_time: float
    str_model_used: str  # 使用的AI模型名称

class DocumentInfo(BaseModel):
    """文档信息"""
    id: str
    filename: str
    file_size: int
    upload_time: str
    chunk_count: int
    status: str

class HealthCheck(BaseModel):
    """健康检查响应"""
    status: str
    version: str
    embedding_model: str
    ai_configured: bool
    documents_count: int

class SystemStats(BaseModel):
    """系统统计信息"""
    total_documents: int
    total_chunks: int
    embedding_model: str
    ai_model: str
    vector_db_path: str
