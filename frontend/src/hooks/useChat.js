// ============================================================
// frontend/src/hooks/useChat.js
// 聊天Hook
// ============================================================

import { useState } from "react";
import { api } from "../services/api";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (question) => {
    const userMsg = {
      type: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await api.query(question);
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
      const errorMsg = {
        type: "error",
        content: error.response?.data?.detail || error.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      throw error;
    } finally {
      setIsProcessing(false);
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
