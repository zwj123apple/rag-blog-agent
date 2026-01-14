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
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 查询
  query: (question, topK = 3) =>
    apiClient.post("/query", { question, top_k: topK }),

  // 获取文档列表
  getDocuments: () => apiClient.get("/documents"),

  // 清空文档
  clearDocuments: () => apiClient.delete("/documents"),

  // 获取统计
  getStats: () => apiClient.get("/stats"),
};

export default apiClient;
