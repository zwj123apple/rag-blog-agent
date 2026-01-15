// ============================================================
// frontend/src/hooks/useDocuments.js
// 文档管理Hook
// ============================================================

import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      setError(null);
      const response = await api.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      const errorInfo = {
        message: err.message,
        details: err.details,
        type: err.type,
      };
      setError(errorInfo);
      console.error("获取文档列表失败:", errorInfo);
    }
  };

  const uploadDocument = async (file, onProgress) => {
    try {
      setUploading(true);
      setError(null);
      const response = await api.uploadDocument(file, onProgress);
      await fetchDocuments();
      return response.data;
    } catch (err) {
      const errorInfo = {
        message: err.message,
        details: err.details,
        type: err.type,
      };
      setError(errorInfo);
      console.error("上传文档失败:", errorInfo);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const clearAllDocuments = async () => {
    try {
      setClearing(true);
      setError(null);
      await api.clearDocuments();
      setDocuments([]);
    } catch (err) {
      const errorInfo = {
        message: err.message,
        details: err.details,
        type: err.type,
      };
      setError(errorInfo);
      console.error("清空文档失败:", errorInfo);
      throw err; // 重新抛出错误，让调用者知道操作失败
    } finally {
      setClearing(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    uploading,
    clearing,
    error,
    uploadDocument,
    clearAllDocuments,
    refreshDocuments: fetchDocuments,
    clearError,
  };
};
