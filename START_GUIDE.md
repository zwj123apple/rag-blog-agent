# 🚀 RAG 博客智能问答系统 - 快速启动指南

## 📋 前置条件

- ✅ Python 3.8+
- ✅ Node.js 18+
- ✅ 阿里云 DashScope API Key

---

## 🔧 第一次启动（完整配置）

### 步骤 1: 配置后端

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境（如果还没有）
python -m venv venv

# 3. 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 配置 API Key
# 编辑 .env 文件，设置你的 DASHSCOPE_API_KEY
notepad .env  # Windows
# nano .env   # Linux/Mac
```

### 步骤 2: 获取阿里云 API Key

1. 访问 https://dashscope.console.aliyun.com/
2. 注册/登录阿里云账号
3. 开通 DashScope 服务
4. 复制 API Key

### 步骤 3: 编辑 .env 文件

```bash
# backend/.env
DASHSCOPE_API_KEY=sk-your-actual-api-key-here  # 👈 替换这里
AI_MODEL=qwen-plus
DEBUG=True
```

### 步骤 4: 启动后端

```bash
# 确保在 backend 目录下
python run.py
```

看到以下输出表示成功：

```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 步骤 5: 配置前端

打开新的终端窗口：

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

看到以下输出表示成功：

```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## ⚡ 日常启动（已配置完成）

### 方式 A: 使用启动脚本（推荐）

**Windows:**

```batch
start_all.bat
```

**Linux/Mac:**

```bash
./start_all.sh
```

### 方式 B: 手动启动

**终端 1 - 后端:**

```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
python run.py
```

**终端 2 - 前端:**

```bash
cd frontend
npm run dev
```

---

## 🌐 访问应用

启动成功后，在浏览器访问：

- **前端界面**: http://localhost:5173
- **后端 API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

---

## 📝 使用流程

1. **上传文档**

   - 点击右侧"上传博客文档"按钮
   - 选择 TXT, MD, PDF 或 DOCX 文件
   - 等待上传和处理完成

2. **提问**

   - 在底部输入框输入问题
   - 点击"发送"或按 Enter
   - 等待 AI 生成回答

3. **查看结果**

   - 查看 AI 回答
   - 查看引用的文档片段
   - 查看相似度分数

4. **管理文档**
   - 右侧面板查看已上传文档
   - 点击"清空"删除所有文档

---

## ⚠️ 常见问题

### 问题 1: 后端启动失败

**错误**: `ModuleNotFoundError: No module named 'dashscope'`

**解决**:

```bash
cd backend
venv\Scripts\activate
pip install dashscope==1.20.9
```

---

### 问题 2: API Key 错误

**错误**: `Invalid API key` 或 `Authentication failed`

**解决**:

1. 检查 `backend/.env` 文件
2. 确认 `DASHSCOPE_API_KEY` 设置正确
3. 确认 API Key 已激活且有余额

---

### 问题 3: 前端空白页面

**解决**:

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

按 `Ctrl+Shift+Delete` 清除浏览器缓存

---

### 问题 4: 端口被占用

**错误**: `Port 8000 is already in use`

**解决**:

```bash
# Windows - 查找并关闭占用端口的进程
netstat -ano | findstr :8000

# 或使用不同端口
cd backend
uvicorn app.main:app --reload --port 8001
```

---

### 问题 5: ChromaDB 警告

**警告**: `Failed to send telemetry event`

**说明**: 这是 ChromaDB 的已知问题，不影响功能，可以忽略。

---

## 🔧 高级配置

### 更改 AI 模型

编辑 `backend/.env`:

```bash
# 选择其中一个
AI_MODEL=qwen-turbo  # 快速、便宜
AI_MODEL=qwen-plus   # 平衡（推荐）
AI_MODEL=qwen-max    # 强大、昂贵
```

### 调整文档处理参数

编辑 `backend/.env`:

```bash
CHUNK_SIZE=500          # 文档块大小
CHUNK_OVERLAP=100       # 块重叠大小
MAX_FILE_SIZE=10485760  # 最大文件大小 (10MB)
```

### 更改端口

**后端**:

```bash
# 编辑 backend/run.py
port=8000  # 改为其他端口
```

**前端**:

```bash
# 在 frontend 目录
npm run dev -- --port 3000
```

---

## 📊 系统要求

### 最低配置

- CPU: 2 核
- 内存: 4GB
- 磁盘: 5GB

### 推荐配置

- CPU: 4 核+
- 内存: 8GB+
- 磁盘: 10GB+

---

## 🛡️ 安全注意事项

1. **不要泄露 API Key**

   - 不要提交 `.env` 文件到 Git
   - 不要在公开场合分享 API Key

2. **定期更新依赖**

   ```bash
   pip install --upgrade -r requirements.txt
   npm update
   ```

3. **生产环境部署**
   - 使用 HTTPS
   - 设置防火墙规则
   - 限制 CORS 来源
   - 启用日志监控

---

## 📚 相关文档

- 📖 **阿里通义千问迁移指南**: `backend/QWEN_MIGRATION.md`
- 🏗️ **前端架构说明**: `frontend/APP_ARCHITECTURE.md`
- 📝 **更新日志**: `backend/CHANGELOG.md`
- 🐛 **调试工具**: http://localhost:5173/debug.html

---

## 💡 提示和技巧

1. **提高回答质量**

   - 上传更多相关文档
   - 使用清晰具体的问题
   - 尝试不同的模型

2. **优化性能**

   - 调整 CHUNK_SIZE 参数
   - 使用 qwen-turbo 提高速度
   - 限制文档数量

3. **节省成本**
   - 使用 qwen-turbo 模型
   - 减少 max_tokens
   - 批量处理问题

---

## 🆘 获取帮助

如遇到问题：

1. 查看本指南的"常见问题"部分
2. 查看详细文档
3. 检查浏览器控制台错误
4. 查看后端日志

---

## 🎉 开始使用

一切准备就绪！现在开始体验智能问答吧！

```bash
# 1. 启动后端
cd backend && python run.py

# 2. 启动前端（新终端）
cd frontend && npm run dev

# 3. 打开浏览器
# http://localhost:5173
```

祝使用愉快！ 🚀
