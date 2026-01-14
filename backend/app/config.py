"""
配置文件
所有系统配置集中管理
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 应用配置
    APP_NAME: str = "RAG Blog Agent"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API配置
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:8080"]
    
    # 向量数据库配置
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    EMBEDDING_MODEL: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    ANONYMIZED_TELEMETRY: bool = False  # 禁用 ChromaDB 遥测
    
    # AI模型配置
    # ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    # OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")
    AI_MODEL: str = "qwen-plus"  # 可选: qwen-turbo, qwen-plus, qwen-max
    
    # 文档处理配置
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 100
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {'.txt', '.md', '.pdf', '.docx', '.doc'}
    
    # 检索配置
    RETRIEVE_TOP_K: int = 3
    SIMILARITY_THRESHOLD: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
