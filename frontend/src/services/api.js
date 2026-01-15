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
  timeout: 300000, // 30秒超时
});

// 错误信息格式化
const formatErrorMessage = (error) => {
  // 调试日志
  console.log("🔍 错误对象详情:", {
    code: error.code,
    message: error.message,
    hasResponse: !!error.response,
    status: error.response?.status,
    data: error.response?.data,
  });

  // HTTP错误（先判断response，优先级最高）
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    console.log(`📡 HTTP错误 - 状态码: ${status}`);

    switch (status) {
      case 400:
        return {
          message: "请求参数错误",
          details: data?.detail || "请检查输入的数据是否正确",
          type: "validation",
        };
      case 404:
        return {
          message: "接口不存在",
          details: "请求的API接口未找到，请联系管理员",
          type: "not_found",
        };
      case 500:
        return {
          message: "服务器内部错误",
          details: data?.detail || "服务器处理请求时发生错误",
          type: "server",
        };
      case 503:
        return {
          message: "服务暂时不可用",
          details: "服务器正在维护或过载，请稍后重试",
          type: "unavailable",
        };
      default:
        return {
          message: `请求失败 (${status})`,
          details: data?.detail || error.message,
          type: "unknown",
        };
    }
  }

  // 网络错误（没有response的情况）
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    console.log("🌐 网络错误");
    return {
      message: "无法连接到服务器",
      details:
        "请检查：\n1. 后端服务是否已启动\n2. 网络连接是否正常\n3. API地址配置是否正确",
      type: "network",
    };
  }

  // 超时错误
  if (error.code === "ECONNABORTED") {
    console.log("⏱️ 超时错误");
    return {
      message: "请求超时",
      details: "服务器响应时间过长，请稍后重试",
      type: "timeout",
    };
  }

  // 其他错误
  console.log("❓ 未知错误类型");
  return {
    message: "未知错误",
    details: error.message || "发生了未知错误",
    type: "unknown",
  };
};

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const formattedError = formatErrorMessage(error);
    console.error("❌ API错误:", formattedError);

    // 创建增强的错误对象
    const enhancedError = new Error(formattedError.message);
    enhancedError.details = formattedError.details;
    enhancedError.type = formattedError.type;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export const api = {
  // 健康检查
  healthCheck: () => apiClient.get("/health"),

  // 上传文档
  uploadDocument: async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    // 上传阶段只占总进度的60%，为服务器处理预留40%
    const UPLOAD_PHASE_MAX = 60;

    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const uploadPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // 将上传进度映射到0-60%
          const adjustedPercent = Math.round(
            (uploadPercent * UPLOAD_PHASE_MAX) / 100
          );
          onProgress(adjustedPercent);
        }
      },
    });

    // 上传完成，模拟服务器处理进度
    if (onProgress) {
      onProgress(70); // 开始处理
      await new Promise((resolve) => setTimeout(resolve, 150));
      onProgress(85); // 处理中
      await new Promise((resolve) => setTimeout(resolve, 150));
      onProgress(95); // 即将完成
    }

    return response;
  },

  // 查询（非流式）
  query: (question, topK = 3, chatHistory = []) =>
    apiClient.post("/query", {
      question,
      top_k: topK,
      chat_history: chatHistory,
    }),

  // 流式查询
  queryStream: async (question, topK = 3, onChunk, chatHistory = []) => {
    const response = await fetch(`${API_BASE_URL}/query/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        top_k: topK,
        chat_history: chatHistory,
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
          if (line.trim()) {
            // SSE 格式: " {json}"
            const dataMatch = line.match(/^\s*(.+)$/);
            if (dataMatch) {
              try {
                const chunk = JSON.parse(dataMatch[1]);
                onChunk(chunk);
              } catch (e) {
                console.error("解析 SSE 数据失败:", e, "原始数据:", line);
              }
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
