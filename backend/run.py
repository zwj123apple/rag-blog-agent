#!/usr/bin/env python
"""
启动脚本 - 从任何位置启动 FastAPI 应用
使用方法: python run.py
"""
import sys
import os
from pathlib import Path

# 将 backend 目录添加到 Python 路径
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# 禁用 ChromaDB telemetry
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY_IMPL"] = "none"

if __name__ == "__main__":
    import uvicorn
    
    # 使用字符串导入以支持 reload
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
