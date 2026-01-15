// ============================================================
// frontend/src/hooks/useChat.js
// 聊天Hook - 支持流式响应
// ============================================================

import { useState } from "react";
import { api } from "../services/api";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 构建对话历史（最多保留最近10条对话）
  const buildChatHistory = (currentMessages) => {
    const history = [];
    // 只取有效的用户和助手消息
    for (const msg of currentMessages) {
      if (msg.type === "user") {
        history.push({ role: "user", content: msg.content });
      } else if (msg.type === "assistant" && msg.content) {
        history.push({ role: "assistant", content: msg.content });
      }
    }
    // 只保留最近10条（5轮对话）
    return history.slice(-10);
  };

  const sendMessage = async (question, useStream = true) => {
    const userMsg = {
      type: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    const assistantMsgId = Date.now();

    if (useStream) {
      // 流式响应模式
      try {
        let currentAnswer = "";
        let retrievedDocs = [];
        let processingTime = 0;

        // 添加空的助手消息占位
        const assistantMsg = {
          id: assistantMsgId,
          type: "assistant",
          content: "",
          retrievedDocs: [],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // 获取当前对话历史（在添加新消息之前）
        const chatHistory = buildChatHistory(messages);
        console.log("📜 发送对话历史:", chatHistory.length, "条");

        // 流式接收数据（传递对话历史）
        await api.queryStream(
          question,
          3,
          (chunk) => {
            console.log("📦 收到数据块:", chunk);

            if (chunk.type === "sources") {
              retrievedDocs = chunk.data;
              console.log("📚 收到文档来源:", retrievedDocs);
              // 立即更新 retrievedDocs
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, retrievedDocs: retrievedDocs }
                    : msg
                )
              );
            } else if (chunk.type === "answer") {
              currentAnswer += chunk.data;
              // 实时更新消息
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        content: currentAnswer,
                        retrievedDocs: retrievedDocs,
                      }
                    : msg
                )
              );
            } else if (chunk.type === "metadata") {
              processingTime = chunk.data.processing_time;
              console.log("ℹ️ 收到元数据:", chunk.data);
              // 最终更新消息，添加处理时间
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        processingTime: processingTime,
                      }
                    : msg
                )
              );
            } else if (chunk.type === "error") {
              console.error("❌ 流式查询错误:", chunk.data);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        type: "error",
                        content: `错误: ${chunk.data}`,
                      }
                    : msg
                )
              );
            }
          },
          chatHistory
        );

        return {
          answer: currentAnswer,
          retrieved_docs: retrievedDocs,
          processing_time: processingTime,
        };
      } catch (error) {
        console.error("流式查询失败:", error);

        // 构建友好的错误消息
        let errorContent = "查询过程中出现错误，请稍后重试。";
        if (error.message) {
          errorContent = error.message;
          if (error.details) {
            errorContent += `\n\n${error.details}`;
          }
        }

        const errorMsg = {
          id: assistantMsgId,
          type: "error",
          content: errorContent,
          errorType: error.type,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? errorMsg : msg))
        );
        throw error;
      } finally {
        setIsProcessing(false);
      }
    } else {
      // 非流式响应模式
      try {
        // 获取当前对话历史
        const chatHistory = buildChatHistory(messages);
        console.log("📜 发送对话历史:", chatHistory.length, "条");

        const response = await api.query(question, 3, chatHistory);
        const assistantMsg = {
          type: "assistant",
          content: response.data.answer,
          retrievedDocs: response.data.retrieved_docs,
          processingTime: response.data.processing_time,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        return response.data;
      } catch (error) {
        // 构建友好的错误消息
        let errorContent = "查询过程中出现错误，请稍后重试。";
        if (error.message) {
          errorContent = error.message;
          if (error.details) {
            errorContent += `\n\n${error.details}`;
          }
        }

        const errorMsg = {
          type: "error",
          content: errorContent,
          errorType: error.type,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearMessages = () => setMessages([]);

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
  };
};
