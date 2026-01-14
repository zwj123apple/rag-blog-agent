# 更新日志

## 2026-01-14 - 修复启动警告

### 🔧 修复内容

1. **修复 ModuleNotFoundError**

   - 创建了 `run.py` 启动脚本，自动处理 Python 路径
   - 更新了 `README.md`，添加了详细的运行说明

2. **修复 LangChain 弃用警告**

   - 将所有 `from langchain.vectorstores` 改为 `from langchain_community.vectorstores`
   - 将所有 `from langchain.embeddings` 改为 `from langchain_community.embeddings`
   - 影响文件:
     - `app/services/rag_service.py`
     - `app/services/embedding_service.py`
     - `app/utils/file_processor.py`

3. **配置 ChromaDB telemetry**
   - 创建了 `.chromarc` 配置文件禁用 telemetry
   - 在 `config.py` 中添加了 `ANONYMIZED_TELEMETRY` 配置项
   - 更新了 `.env` 和 `.env.example`

### ⚠️ 已知问题

1. **ChromaDB telemetry 错误**（不影响功能）

   ```
   Failed to send telemetry event: capture() takes 1 positional argument but 3 were given
   ```

   - 这是 ChromaDB 0.4.22 的已知 bug
   - 不影响应用功能
   - 建议未来升级到更新版本

2. **Pydantic 命名空间警告**（不影响功能）
   ```
   Field "model_used" has conflict with protected namespace "model_"
   ```
   - 可以通过设置 `model_config['protected_namespaces'] = ()` 解决
   - 目前不影响功能使用

### ✅ 验证结果

- ✅ 应用可以正常启动
- ✅ 所有导入语句更新完成
- ✅ LangChain 弃用警告已消除
- ✅ 功能正常运行

### 📝 运行方式

```bash
# 方法 1: 使用启动脚本（推荐）
cd backend
python run.py

# 方法 2: 使用 uvicorn
cd backend
uvicorn app.main:app --reload

# 方法 3: 使用 Python 模块
cd backend
python -m app.main
```
