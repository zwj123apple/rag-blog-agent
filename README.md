# 🤖 RAG 博客智能问答系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**基于 RAG（检索增强生成）技术的智能博客问答系统**

使用阿里通义千问大模型 + 向量数据库，快速构建你的知识问答助手

[快速开始](#-快速开始) • [功能特性](#-核心特性) • [文档](#-文档导航) • [演示](#-使用演示)

</div>

---

## 📖 项目简介

RAG 博客智能问答系统是一个基于检索增强生成（Retrieval-Augmented Generation）技术的智能问答应用。它能够：

- 📝 **上传文档**：支持 TXT、MD、PDF、DOCX 等多种格式
- 🔍 **智能检索**：使用向量数据库快速定位相关内容
- 💬 **AI 问答**：结合检索结果和大语言模型生成准确答案
- 🎯 **实时反馈**：展示相关文档片段和相似度评分
- 🚀 **易于部署**：支持本地运行和 Docker 容器化部署

### 适用场景

- 📚 个人知识库管理
- 📖 博客文章智能检索
- 📑 技术文档问答助手
- 🏢 企业内部知识库
- 🎓 学习笔记智能检索

---

## ✨ 核心特性

### 🎯 智能问答

- ✅ 基于 RAG 技术，结合检索和生成
- ✅ 支持上下文理解和多轮对话
- ✅ 展示相关文档片段和来源
- ✅ 实时相似度评分

### 📄 文档处理

- ✅ 支持多种文档格式（TXT、MD、PDF、DOCX）
- ✅ 智能文本分块和向量化
- ✅ 批量文档上传
- ✅ 文档管理和删除

### 🔍 向量检索

- ✅ ChromaDB 向量数据库
- ✅ 高性能相似度搜索
- ✅ 支持中英文多语言
- ✅ 可调节检索参数

### 🤖 AI 模型

- ✅ 阿里通义千问（Qwen）大模型
- ✅ 支持多个模型版本（turbo/plus/max）
- ✅ 可配置温度和采样参数
- ✅ 流式输出支持

### 💻 用户界面

- ✅ 现代化 React 界面
- ✅ 响应式设计，支持移动端
- ✅ 实时消息展示
- ✅ 系统状态监控

---

## 🛠️ 技术栈

### 后端技术

| 技术                      | 版本    | 说明               |
| ------------------------- | ------- | ------------------ |
| **FastAPI**               | 0.109.0 | 高性能 Web 框架    |
| **LangChain**             | 0.1.16  | LLM 应用开发框架   |
| **ChromaDB**              | 0.4.24  | 向量数据库         |
| **Sentence Transformers** | 2.5.1   | 文本向量化模型     |
| **Qwen (DashScope)**      | Latest  | 阿里通义千问大模型 |
| **Python**                | 3.8+    | 编程语言           |

### 前端技术

| 技术             | 版本    | 说明        |
| ---------------- | ------- | ----------- |
| **React**        | 19.2.0  | UI 框架     |
| **Vite**         | 7.2.4   | 构建工具    |
| **Tailwind CSS** | 4.1.18  | CSS 框架    |
| **Axios**        | 1.13.2  | HTTP 客户端 |
| **Lucide React** | 0.562.0 | 图标库      |

### 开发工具

- **Docker** - 容器化部署
- **pytest** - 单元测试
- **ESLint** - 代码规范

---

## 🚀 快速开始

### 📋 前置要求

- ✅ Python 3.8 或更高版本
- ✅ Node.js 18 或更高版本
- ✅ 阿里云 DashScope API Key（[获取地址](https://dashscope.console.aliyun.com/)）

### ⚡ 快速启动（推荐）

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/rag-blog-agent.git
cd rag-blog-agent
```

#### 2. 配置后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置你的 DASHSCOPE_API_KEY
```

#### 3. 配置前端

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖
npm install
```

#### 4. 启动服务

**终端 1 - 后端：**

```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
python run.py
```

**终端 2 - 前端：**

```bash
cd frontend
npm run dev
```

#### 5. 访问应用

- 🌐 **前端界面**：http://localhost:5173
- 📚 **API 文档**：http://localhost:8000/docs
- ❤️ **健康检查**：http://localhost:8000/health

---

## 📚 文档导航

### 核心文档

| 文档                                             | 说明                 |
| ------------------------------------------------ | -------------------- |
| [📖 快速启动指南](START_GUIDE.md)                | 详细的安装和启动步骤 |
| [🔧 故障排除指南](TROUBLESHOOTING.md)            | 常见问题和解决方案   |
| [🔄 阿里通义千问迁移](backend/QWEN_MIGRATION.md) | AI 模型集成说明      |
| [🏗️ 前端架构说明](frontend/APP_ARCHITECTURE.md)  | 前端组件和架构       |
| [📝 更新日志](backend/CHANGELOG.md)              | 版本更新记录         |

### 专项文档

- [📖 后端文档](backend/README.md) - 后端 API 和架构
- [📖 前端文档](frontend/README.md) - 前端组件和开发

---

## 📁 项目结构

```
rag-blog-agent/
├── backend/                    # 后端服务
│   ├── app/
│   │   ├── api/               # API 路由
│   │   │   ├── __init__.py
│   │   │   ├── routes.py      # 路由定义
│   │   │   └── dependencies.py # 依赖注入
│   │   ├── services/          # 业务逻辑
│   │   │   ├── rag_service.py       # RAG 核心服务
│   │   │   ├── document_service.py  # 文档处理服务
│   │   │   └── embedding_service.py # 向量化服务
│   │   ├── utils/             # 工具函数
│   │   │   ├── file_processor.py    # 文件处理
│   │   │   └── vector_utils.py      # 向量操作
│   │   ├── config.py          # 配置管理
│   │   ├── models.py          # 数据模型
│   │   └── main.py            # 应用入口
│   ├── tests/                 # 测试文件
│   ├── chroma_db/             # 向量数据库存储
│   ├── requirements.txt       # Python 依赖
│   ├── run.py                 # 启动脚本
│   ├── .env.example           # 环境变量示例
│   └── README.md              # 后端文档
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   │   ├── ChatInterface.jsx      # 聊天界面
│   │   │   ├── DocumentManager.jsx    # 文档管理
│   │   │   ├── FileUploader.jsx       # 文件上传
│   │   │   ├── MessageList.jsx        # 消息列表
│   │   │   ├── SystemStats.jsx        # 系统状态
│   │   │   └── ErrorAlert.jsx         # 错误提示
│   │   ├── hooks/             # 自定义 Hooks
│   │   │   ├── useChat.js             # 聊天逻辑
│   │   │   └── useDocuments.js        # 文档管理逻辑
│   │   ├── services/          # API 服务
│   │   │   ├── api.js                 # API 调用
│   │   │   └── apiConfig.js           # API 配置
│   │   ├── utils/             # 工具函数
│   │   ├── App.jsx            # 主应用组件
│   │   ├── main.jsx           # 应用入口
│   │   └── index.css          # 全局样式
│   ├── public/                # 静态资源
│   ├── package.json           # NPM 依赖
│   ├── vite.config.js         # Vite 配置
│   └── README.md              # 前端文档
│
├── .gitignore                 # Git 忽略文件
├── docker-compose.yml         # Docker 编排（可选）
├── START_GUIDE.md             # 快速启动指南
├── TROUBLESHOOTING.md         # 故障排除指南
└── README.md                  # 项目主文档（本文件）
```

---

## 🔧 配置说明

### 后端配置（backend/.env）

```bash
# AI 模型配置（必需）
DASHSCOPE_API_KEY=your_api_key_here
AI_MODEL=qwen-plus  # 可选: qwen-turbo, qwen-plus, qwen-max

# 应用配置
APP_NAME=RAG Blog Agent
VERSION=1.0.0
DEBUG=False

# 向量数据库配置
CHROMA_PERSIST_DIR=./chroma_db
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

# 文档处理配置
CHUNK_SIZE=500              # 文档分块大小
CHUNK_OVERLAP=100           # 块重叠大小
MAX_FILE_SIZE=10485760      # 最大文件大小（10MB）

# 检索配置
RETRIEVE_TOP_K=3            # 检索返回的文档块数量
SIMILARITY_THRESHOLD=0.7    # 相似度阈值
```

### 前端配置（frontend/.env）

```bash
VITE_API_URL=http://localhost:8000
```

---

## 📖 使用演示

### 1. 上传文档

1. 点击右侧面板的"上传博客文档"按钮
2. 选择 TXT、MD、PDF 或 DOCX 文件
3. 等待文档上传和处理完成
4. 文档列表会自动更新

### 2. 智能问答

1. 在底部输入框输入你的问题
2. 点击"发送"按钮或按 Enter 键
3. AI 会基于已上传的文档生成回答
4. 查看相关文档片段和相似度评分

### 3. 文档管理

1. 在右侧面板查看所有已上传的文档
2. 点击"清空所有文档"按钮删除所有文档
3. 系统会自动清空对话历史

---

## 🧪 API 文档

启动后端服务后，访问以下地址查看完整 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 主要 API 端点

| 端点                | 方法   | 说明             |
| ------------------- | ------ | ---------------- |
| `/health`           | GET    | 健康检查         |
| `/api/v1/documents` | GET    | 获取文档列表     |
| `/api/v1/upload`    | POST   | 上传文档         |
| `/api/v1/clear`     | DELETE | 清空所有文档     |
| `/api/v1/query`     | POST   | 提问并获取答案   |
| `/api/v1/stats`     | GET    | 获取系统统计信息 |

---

## 🧪 测试

### 运行后端测试

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pytest
```

### 运行前端测试

```bash
cd frontend
npm run test
```

---

## 🐛 常见问题

### 问题 1: 无法连接到后
