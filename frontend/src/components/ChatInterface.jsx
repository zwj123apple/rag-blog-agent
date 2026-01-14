// ============================================================
// frontend/src/components/ChatInterface.jsx
// 对话界面组件
// ============================================================

import React from "react";
import { MessageList } from "./MessageList";
import { Send, Loader2 } from "lucide-react";

export const ChatInterface = ({
  messages,
  input,
  setInput,
  onSend,
  isProcessing,
  documentsExist,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 消息列表 - 添加 flex-1 和 overflow-hidden 使其可滚动 */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={documentsExist ? "输入您的问题..." : "请先上传文档..."}
            disabled={isProcessing || !documentsExist}
            className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={onSend}
            disabled={isProcessing || !input.trim() || !documentsExist}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>处理中</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>发送</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 使用 FastAPI + LangChain + ChromaDB + Claude 构建
        </p>
      </div>
    </div>
  );
};
