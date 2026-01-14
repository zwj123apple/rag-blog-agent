// ============================================================
// frontend/README.md
// 前端文档
// ============================================================

# RAG 博客 Agent - 前端

## 技术栈

- React 18
- Tailwind CSS
- Axios
- Lucide React Icons

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/      # React组件
├── hooks/          # 自定义Hooks
├── services/       # API服务
├── utils/          # 工具函数
├── styles/         # 样式文件
├── App.jsx         # 主应用
└── index.js        # 入口文件
```

## 环境变量

创建 `.env` 文件：

```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## 组件说明

- `ChatInterface`: 对话界面
- `DocumentManager`: 文档管理
- `FileUploader`: 文件上传
- `MessageList`: 消息列表
- `SystemStats`: 系统状态

## API 集成

所有 API 调用通过 `src/services/api.js` 进行，使用 axios 客户端。
