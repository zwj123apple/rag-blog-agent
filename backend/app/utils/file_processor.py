# ============================================================
# backend/app/utils/file_processor.py
# ============================================================
"""
文件处理工具
"""
import os
import hashlib
from typing import Optional

class FileProcessor:
    """文件处理工具类"""
    
    @staticmethod
    def get_file_hash(content: bytes) -> str:
        """
        计算文件哈希值
        
        Args:
            content: 文件内容
            
        Returns:
            MD5哈希值
        """
        return hashlib.md5(content).hexdigest()
    
    @staticmethod
    def get_file_extension(filename: str) -> str:
        """
        获取文件扩展名
        
        Args:
            filename: 文件名
            
        Returns:
            扩展名（小写）
        """
        return os.path.splitext(filename)[1].lower()
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """
        清理文件名，移除特殊字符
        
        Args:
            filename: 原始文件名
            
        Returns:
            清理后的文件名
        """
        # 移除路径分隔符和特殊字符
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename
    
    @staticmethod
    def format_file_size(size_bytes: int) -> str:
        """
        格式化文件大小
        
        Args:
            size_bytes: 字节数
            
        Returns:
            可读的文件大小字符串
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} TB"
