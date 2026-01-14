# ============================================================

# backend/README.md

# 后端文档

# ============================================================

# RAG 博客 Agent - 后端

## 技术栈

- **FastAPI**: Web 框架
- **LangChain**: LLM 应用框架
- **ChromaDB**: 向量数据库
- **Sentence Transformers**: 文本向量化
- **Claude/GPT**: 大语言模型

## 安装

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env文件，添加API密钥
```

## 运行应用

⚠️ **重要**: 请确保在 `backend` 目录下运行以下命令

### 方法 1: 使用启动脚本 (最简单)

```bash
# 确保在 backend 目录下
cd backend

# 运行启动脚本
python run.py
```

### 方法 2: 使用 uvicorn (推荐用于生产)

```bash
# 确保在 backend 目录下
cd backend

# 开发模式
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 方法 3: 使用 Python 模块方式

```bash
# 确保在 backend 目录下
cd backend

# 运行应用
python -m app.main
```

启动成功后访问:

- API 文档: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- 健康检查: http://localhost:8000/health

## API 文档

启动服务器后访问：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 项目结构

```
backend/
├── app/
│   ├── api/          # API路由
│   ├── services/     # 业务逻辑
│   ├── models.py     # 数据模型
│   ├── config.py     # 配置
│   └── main.py       # 应用入口
├── tests/            # 测试
└── requirements.txt  # 依赖
```

## 测试

```bash
pytest
```
