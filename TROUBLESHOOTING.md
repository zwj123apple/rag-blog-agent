# 🔧 故障排除指南

## ❌ 前端显示 "ERR_CONNECTION_REFUSED"

### 问题症状

```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:8000/api/v1/stats
http://localhost:8000/api/v1/documents
```

### 原因

后端服务器没有运行或端口不对。

---

## ✅ 完整解决步骤

### 步骤 1: 确认后端是否运行

#### 方法 A: 检查进程

```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

如果没有输出，说明后端没有运行。

#### 方法 B: 测试连接

在浏览器访问: http://localhost:8000/health

- ✅ 如果看到 JSON 响应 → 后端正常运行
- ❌ 如果无法访问 → 后端没有运行

---

### 步骤 2: 启动后端

```bash
# 1. 打开终端，进入 backend 目录
cd C:\ai\rag-blog-agent\backend

# 2. 激活虚拟环境
venv\Scripts\activate

# 3. 确认已安装所有依赖
pip install -r requirements.txt

# 4. 启动后端
python run.py
```

**成功的输出应该是:**

```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

### 步骤 3: 启动前端

**打开新的终端窗口:**

```bash
# 1. 进入 frontend 目录
cd C:\ai\rag-blog-agent\frontend

# 2. 确认已安装依赖
npm install

# 3. 启动前端
npm run dev
```

**成功的输出应该是:**

```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### 步骤 4: 验证连接

1. **打开浏览器:** http://localhost:5173
2. **打开开发者工具:** 按 F12
3. **检查 Console 标签:**

   - ✅ 没有错误 → 连接成功
   - ❌ 有 ERR_CONNECTION_REFUSED → 继续下面的步骤

4. **检查 Network 标签:**
   - 查看请求状态
   - ✅ 200 OK → 成功
   - ❌ (failed) → 后端未运行

---

## 🔍 常见问题

### 问题 1: 端口被占用

**错误信息:**

```
Error: Address already in use
Port 8000 is already in use
```

**解决方法:**

```bash
# Windows - 查找并结束进程
netstat -ano | findstr :8000
taskkill /PID <进程ID> /F

# 或使用不同端口
cd backend
# 编辑 run.py, 将 port=8000 改为 port=8001
```

---

### 问题 2: Python 模块未找到

**错误信息:**

```
ModuleNotFoundError: No module named 'fastapi'
ModuleNotFoundError: No module named 'dashscope'
```

**解决方法:**

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

---

### 问题 3: API Key 未配置

**错误信息:**

```
API Key is required
Authentication failed
```

**解决方法:**

1. 编辑 `backend/.env` 文件
2. 设置你的 API Key:

```bash
DASHSCOPE_API_KEY=sk-your-actual-api-key-here
```

3. 重启后端

---

### 问题 4: CORS 错误

**错误信息:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**解决方法:**

检查 `backend/.env` 中的 ALLOWED_ORIGINS:

```bash
ALLOWED_ORIGINS=["http://localhost:5173"]
```

确保包含前端的实际地址。

---

### 问题 5: 虚拟环境未激活

**症状:** 命令行提示符前没有 `(venv)`

**解决方法:**

```bash
# Windows
cd backend
venv\Scripts\activate

# Linux/Mac
cd backend
source venv/bin/activate
```

---

## 📋 快速检查清单

运行前请确认:

- [ ] ✅ Python 3.8+ 已安装
- [ ] ✅ Node.js 18+ 已安装
- [ ] ✅ 后端虚拟环境已创建并激活
- [ ] ✅ 后端依赖已安装 (`pip install -r requirements.txt`)
- [ ] ✅ 前端依赖已安装 (`npm install`)
- [ ] ✅ API Key 已配置在 `.env` 文件
- [ ] ✅ 端口 8000 和 5173 没有被占用
- [ ] ✅ 两个终端窗口都在运行

---

## 🛠️ 完整重启流程

如果遇到问题，尝试完全重启:

### 1. 停止所有服务

- 在后端终端按 `Ctrl+C`
- 在前端终端按 `Ctrl+C`

### 2. 清理缓存

```bash
# 后端
cd backend
rm -rf __pycache__
rm -rf app/__pycache__

# 前端
cd frontend
rm -rf .vite
```

### 3. 重新启动

```bash
# 终端 1 - 后端
cd backend
venv\Scripts\activate
python run.py

# 终端 2 - 前端
cd frontend
npm run dev
```

### 4. 刷新浏览器

- 按 `Ctrl+Shift+R` 强制刷新
- 或清除浏览器缓存

---

## 🔬 调试技巧

### 查看后端日志

后端终端会显示所有请求:

```
INFO:     127.0.0.1:xxxxx - "GET /api/v1/health HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "GET /api/v1/documents HTTP/1.1" 200 OK
```

### 查看前端控制台

按 F12 打开开发者工具:

- **Console**: 查看 JavaScript 错误
- **Network**: 查看 API 请求状态
- **Application**: 查看 localStorage 数据

### 测试 API 直接访问

在浏览器直接访问 API:

- http://localhost:8000/health
- http://localhost:8000/docs
- http://localhost:8000/api/v1/stats

---

## 📞 还是不行？

### 检查这些内容:

1. **后端日志完整输出**

   - 复制终端中的所有错误信息

2. **前端控制台错误**

   - 按 F12，查看 Console 标签
   - 截图或复制错误信息

3. **环境信息**

   ```bash
   # Python 版本
   python --version

   # Node 版本
   node --version

   # 端口占用情况
   netstat -ano | findstr :8000
   netstat -ano | findstr :5173
   ```

4. **配置文件内容**
   - `backend/.env` (隐藏 API Key)
   - `frontend/src/services/apiConfig.js`

---

## ✅ 成功标志

当一切正常时，你应该看到:

### 后端终端:

```
✅ INFO:     Uvicorn running on http://0.0.0.0:8000
✅ INFO:     Application startup complete
```

### 前端终端:

```
✅ VITE v7.x.x  ready in xxx ms
✅ ➜  Local:   http://localhost:5173/
```

### 浏览器:

```
✅ 页面正常显示，没有空白
✅ 右侧面板显示"系统状态"
✅ Console 没有错误
✅ Network 标签显示 200 状态码
```

---

## 🎉 正常运行

如果看到以上所有 ✅，恭喜！系统正常运行！

现在可以:

1. 上传博客文档
2. 输入问题
3. 获得 AI 回答

开始体验吧！🚀
