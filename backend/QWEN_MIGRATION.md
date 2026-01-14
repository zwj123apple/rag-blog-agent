# 阿里通义千问集成说明

## 📋 概述

本项目已从 Claude 迁移到阿里通义千问（Qwen）大语言模型。

## 🔄 更改内容

### 1. 依赖更新

**requirements.txt**

```diff
- anthropic==0.18.1
+ dashscope==1.20.9  # 阿里通义千问 SDK
```

### 2. 配置更新

**backend/app/config.py**

```python
# 新增配置
DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")
AI_MODEL: str = "qwen-plus"  # 可选: qwen-turbo, qwen-plus, qwen-max
```

### 3. 服务更新

**backend/app/services/rag_service.py**

```python
# 导入
import dashscope
from dashscope import Generation

# 初始化
if settings.DASHSCOPE_API_KEY:
    dashscope.api_key = settings.DASHSCOPE_API_KEY

# API 调用
response = Generation.call(
    model=settings.AI_MODEL,
    prompt=prompt,
    max_tokens=1024,
    temperature=0.7,
    top_p=0.8
)
```

## 🚀 快速开始

### 步骤 1: 获取 API Key

1. 访问 [阿里云百炼平台](https://dashscope.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 开通 DashScope 服务
4. 在控制台获取 API Key

### 步骤 2: 配置环境变量

编辑 `backend/.env` 文件：

```bash
# 阿里通义千问 API Key
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 选择模型 (qwen-turbo, qwen-plus, qwen-max)
AI_MODEL=qwen-plus
```

### 步骤 3: 安装依赖

```bash
cd backend

# 如果还没有创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装新依赖
pip install dashscope==1.20.9

# 或重新安装所有依赖
pip install -r requirements.txt
```

### 步骤 4: 启动应用

```bash
# 在 backend 目录下
python run.py

# 或使用 uvicorn
uvicorn app.main:app --reload
```

## 🎯 可用模型

| 模型名称     | 说明       | 适用场景             |
| ------------ | ---------- | -------------------- |
| `qwen-turbo` | 快速版本   | 高并发、低延迟场景   |
| `qwen-plus`  | 平衡版本   | 通用场景（推荐）     |
| `qwen-max`   | 高性能版本 | 复杂任务、高质量输出 |

### 模型特点对比

```
qwen-turbo:
  ✅ 响应速度快
  ✅ 成本低
  ⚠️  性能中等

qwen-plus:
  ✅ 性能优秀
  ✅ 性价比高
  ✅ 推荐使用

qwen-max:
  ✅ 性能最强
  ✅ 理解能力最好
  ⚠️  成本较高
```

## 💰 计费说明

通义千问采用按量计费：

- **qwen-turbo**: ~￥ 0.008/千 tokens
- **qwen-plus**: ~￥ 0.02/千 tokens
- **qwen-max**: ~￥ 0.12/千 tokens

> 注意：具体价格以阿里云官网为准

## 🔧 API 参数说明

```python
response = Generation.call(
    model="qwen-plus",           # 模型名称
    prompt="你的问题",           # 输入文本
    max_tokens=1024,             # 最大生成长度
    temperature=0.7,             # 温度系数 (0-2)
    top_p=0.8,                   # 核采样参数
    top_k=50,                    # Top-K 采样
    repetition_penalty=1.1,      # 重复惩罚
    enable_search=False,         # 是否联网搜索
)
```

### 参数详解

- **temperature**: 控制随机性

  - 0.1-0.5: 更确定的输出
  - 0.7: 平衡（推荐）
  - 1.0-2.0: 更有创造性

- **top_p**: 核采样
  - 0.8: 平衡（推荐）
  - 0.95: 更多样化
  - 0.5: 更确定

## 📊 性能对比

### Claude vs Qwen

| 指标     | Claude     | Qwen-Plus  |
| -------- | ---------- | ---------- |
| 中文理解 | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |
| 响应速度 | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |
| 成本     | 较高       | 较低       |
| 国内访问 | 需要代理   | 直接访问   |
| 文档质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |

## 🛠️ 故障排除

### 问题 1: API Key 无效

**错误信息:**

```
Invalid API key
```

**解决方法:**

1. 检查 API Key 是否正确复制
2. 确认 API Key 是否已激活
3. 检查账户余额是否充足

### 问题 2: 导入错误

**错误信息:**

```
ModuleNotFoundError: No module named 'dashscope'
```

**解决方法:**

```bash
pip install dashscope==1.20.9
```

### 问题 3: 网络连接问题

**错误信息:**

```
Connection timeout
```

**解决方法:**

1. 检查网络连接
2. 确认防火墙设置
3. 尝试使用代理（如需要）

### 问题 4: 模型不存在

**错误信息:**

```
Model not found: xxx
```

**解决方法:**
确保使用正确的模型名称：

- `qwen-turbo`
- `qwen-plus`
- `qwen-max`

## 📝 代码示例

### 基础调用

```python
import dashscope
from dashscope import Generation

# 设置 API Key
dashscope.api_key = "your-api-key"

# 调用模型
response = Generation.call(
    model="qwen-plus",
    prompt="介绍一下人工智能"
)

# 获取结果
if response.status_code == 200:
    print(response.output.text)
else:
    print(f"错误: {response.message}")
```

### 流式输出

```python
responses = Generation.call(
    model="qwen-plus",
    prompt="写一首诗",
    stream=True
)

for response in responses:
    if response.status_code == 200:
        print(response.output.text, end='')
```

### 带历史对话

```python
messages = [
    {"role": "system", "content": "你是一个helpful assistant"},
    {"role": "user", "content": "你好"},
    {"role": "assistant", "content": "你好！有什么可以帮助你的吗？"},
    {"role": "user", "content": "今天天气怎么样？"}
]

response = Generation.call(
    model="qwen-plus",
    messages=messages
)
```

## 🔗 相关链接

- [阿里云百炼平台](https://dashscope.console.aliyun.com/)
- [DashScope API 文档](https://help.aliyun.com/zh/dashscope/)
- [通义千问官网](https://tongyi.aliyun.com/)
- [计费说明](https://help.aliyun.com/zh/dashscope/developer-reference/billing-1)

## ⚠️ 注意事项

1. **API Key 安全**

   - 不要将 API Key 提交到版本控制
   - 使用环境变量存储
   - 定期轮换 API Key

2. **成本控制**

   - 监控 API 调用量
   - 设置合理的 max_tokens
   - 使用合适的模型

3. **错误处理**

   - 始终检查 response.status_code
   - 实现重试机制
   - 提供降级方案

4. **内容安全**
   - 遵守平台使用规范
   - 过滤敏感内容
   - 注意数据隐私

## 📞 技术支持

如遇到问题，可以：

1. 查看[阿里云帮助文档](https://help.aliyun.com/zh/dashscope/)
2. 访问[开发者社区](https://developer.aliyun.com/)
3. 提交工单获取官方支持

## 🎉 完成！

现在你的 RAG 博客系统已经成功集成了阿里通义千问模型！

开始体验吧：

```bash
cd backend
python run.py
```
