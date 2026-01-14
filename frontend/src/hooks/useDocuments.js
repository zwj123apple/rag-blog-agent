// ============================================================
// frontend/src/hooks/useDocuments.js
// 文档管理Hook
// ============================================================

import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.uploadDocument(file);
      await fetchDocuments();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearAllDocuments = async () => {
    try {
      setLoading(true);
      await api.clearDocuments();
      setDocuments([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    clearAllDocuments,
    refreshDocuments: fetchDocuments,
  };
};
