// ============================================================
// frontend/src/App.jsx
// 主应用组件
// ============================================================

import React, { useState } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { DocumentManager } from "./components/DocumentManager";
import { SystemStats } from "./components/SystemStats";
import { useChat } from "./hooks/useChat";
import { useDocuments } from "./hooks/useDocuments";
import { MessageSquare, FileText, AlertCircle } from "lucide-react";

function App() {
  const [input, setInput] = useState("");
  const { messages, isProcessing, sendMessage, clearMessages } = useChat();
  const {
    documents,
    uploading: isUploading,
    clearing: isClearing,
    error: documentError,
    uploadDocument,
    clearAllDocuments,
    clearError: clearDocumentError,
  } = useDocuments();

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("发送消息失败:", error);
    }
  };

  // 处理文件上传
  const handleUploadFile = async (file, onProgress) => {
    try {
      await uploadDocument(file, onProgress);
    } catch (error) {
      console.error("上传失败:", error);
    }
  };

  // 处理清空文档
  const handleClearDocuments = async () => {
    if (window.confirm("确定要清空所有文档吗？这将删除所有向量数据。")) {
      try {
        await clearAllDocuments();
        clearMessages();
      } catch (error) {
        console.error("清空文档失败:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="h-screen flex flex-col">
        {/* 顶部标题栏 */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    RAG 博客智能问答
                  </h1>
                  <p className="text-sm text-gray-500">
                    基于检索增强生成的文档问答系统
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      {documents.length}
                    </span>
                    <span className="text-blue-700">个文档</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧：聊天界面 */}
          <div className="flex-1 flex flex-col">
            <ChatInterface
              messages={messages}
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              isProcessing={isProcessing}
              documentsExist={documents.length > 0}
            />
          </div>

          {/* 右侧：文档管理面板 */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
            {/* 系统状态 */}
            <SystemStats />

            {/* 文档管理（包含上传和列表） */}
            <DocumentManager
              documents={documents}
              onClear={handleClearDocuments}
              onUpload={handleUploadFile}
              isUploading={isUploading}
              isClearing={isClearing}
              error={documentError}
              onClearError={clearDocumentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
