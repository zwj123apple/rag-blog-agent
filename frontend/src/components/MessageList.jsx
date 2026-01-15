// ============================================================
// frontend/src/components/MessageList.jsx
// 消息列表组件
// ============================================================

import React, { useRef, useEffect } from "react";
import {
  Brain,
  Database,
  Loader2,
  AlertCircle,
  CheckCircle,
  Wifi,
  Clock,
  XCircle,
} from "lucide-react";

export const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (msg) => {
    if (msg.type === "system") {
      return (
        <div className="flex justify-start">
          <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {msg.content}
          </div>
        </div>
      );
    }

    if (msg.type === "error") {
      // 根据错误类型选择图标和样式
      const getErrorIcon = (errorType) => {
        switch (errorType) {
          case "network":
            return Wifi;
          case "timeout":
            return Clock;
          case "server":
          case "validation":
            return XCircle;
          default:
            return AlertCircle;
        }
      };

      const ErrorIcon = getErrorIcon(msg.errorType);

      return (
        <div className="flex justify-start">
          <div className="max-w-2xl px-5 py-4 bg-red-50 border border-red-200 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <ErrorIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-red-700">错误</span>
                  <span className="text-xs text-red-500">
                    {new Date(msg.timestamp).toLocaleTimeString("zh-CN")}
                  </span>
                </div>
                <p className="text-sm text-red-800 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === "thinking") {
      return (
        <div className="flex justify-start">
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            {msg.content}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex ${
          msg.type === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-3xl px-5 py-4 rounded-xl shadow-md ${
            msg.type === "user"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span
              className={`text-xs font-medium ${
                msg.type === "user" ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {msg.type === "user" ? "您" : "AI助手"}
            </span>
            <span
              className={`text-xs ${
                msg.type === "user" ? "text-blue-200" : "text-gray-400"
              }`}
            >
              {new Date(msg.timestamp).toLocaleTimeString("zh-CN")}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {msg.content}
          </p>

          {msg.retrievedDocs && msg.retrievedDocs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                <Database className="w-3 h-3" />
                检索到 {msg.retrievedDocs.length} 个相关文档
                {msg.processingTime && (
                  <span className="text-gray-400">
                    (用时 {msg.processingTime.toFixed(2)}s)
                  </span>
                )}
              </p>
              <div className="space-y-2">
                {msg.retrievedDocs.map((doc, i) => (
                  <div
                    key={i}
                    className="text-xs bg-gray-50 p-2 rounded border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700">
                        📄 {doc.metadata.filename}
                      </span>
                      <span className="text-gray-500">
                        相似度: {(doc.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {doc.content.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="text-center py-16">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            欢迎使用RAG博客问答系统
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            上传您的博客文档，基于向量检索和AI生成技术，快速获取准确答案
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx}>{renderMessage(msg, idx)}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
