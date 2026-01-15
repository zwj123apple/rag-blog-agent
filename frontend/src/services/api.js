// ============================================================
// frontend/src/services/api.js
// API服务层
// ============================================================

import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // 健康检查
  healthCheck: () => apiClient.get("/health"),

  // 上传文档
  uploadDocument: (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // 查询（非流式）
  query: (question, topK = 3) =>
    apiClient.post("/query", { question, top_k: topK }),

  // 流式查询
  queryStream: async (question, topK = 3, onChunk) => {
    const response = await fetch(`${API_BASE_URL}/query/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");

        // 保留最后一个不完整的行
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith(" ")) {
            const data = line.slice(6);
            try {
              const chunk = JSON.parse(data);
              onChunk(chunk);
            } catch (e) {
              console.error("解析 SSE 数据失败:", e, data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  // 获取文档列表
  getDocuments: () => apiClient.get("/documents"),

  // 清空文档
  clearDocuments: () => apiClient.delete("/documents"),

  // 获取统计
  getStats: () => apiClient.get("/stats"),
};

export default apiClient;
