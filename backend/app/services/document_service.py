# ============================================================
# backend/app/services/document_service.py
# 文档处理服务
# ============================================================

"""
文档处理服务
负责文件验证、文本提取等
"""
import io
from fastapi import HTTPException
import PyPDF2
from docx import Document as DocxDocument
from app.config import settings

class DocumentService:
    """文档处理服务类"""
    
    def validate_file(self, filename: str, file_size: int):
        """验证文件"""
        # 检查文件扩展名
        ext = filename[filename.rfind('.'):].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件格式。支持: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        
        # 检查文件大小
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"文件过大。最大: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
            )
    
    def extract_text(self, content: bytes, filename: str) -> str:
        """从文件中提取文本"""
        ext = filename[filename.rfind('.'):].lower()
        
        try:
            if ext in ['.txt', '.md']:
                return content.decode('utf-8')
            elif ext == '.pdf':
                return self._extract_pdf(content)
            elif ext in ['.docx', '.doc']:
                return self._extract_docx(content)
            else:
                raise ValueError(f"不支持的格式: {ext}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"文件解析失败: {str(e)}")
    
    def _extract_pdf(self, content: bytes) -> str:
        """提取PDF文本"""
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    
    def _extract_docx(self, content: bytes) -> str:
        """提取DOCX文本"""
        doc_file = io.BytesIO(content)
        doc = DocxDocument(doc_file)
        return "\n".join([p.text for p in doc.paragraphs])
