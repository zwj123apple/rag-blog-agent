// ============================================================
// frontend/src/components/SystemStats.jsx
// 系统统计组件
// ============================================================

import React, { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { api } from "../services/api";

export const SystemStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getStats();
        setStats(response.data);
      } catch (err) {
        console.error("获取统计失败:", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="p-4 bg-blue-50 border-b border-blue-100">
      <div className="flex items-center gap-2 text-sm text-blue-800 mb-2">
        <Database className="w-4 h-4" />
        <span className="font-semibold">系统状态</span>
      </div>
      <div className="space-y-1 text-xs text-blue-700">
        <div className="flex justify-between">
          <span>文档数量:</span>
          <span className="font-semibold">{stats.total_documents}</span>
        </div>
        <div className="flex justify-between">
          <span>向量块:</span>
          <span className="font-semibold">{stats.total_chunks}</span>
        </div>
        <div className="flex justify-between">
          <span>AI模型:</span>
          <span className="font-semibold text-xs">{stats.ai_model}</span>
        </div>
      </div>
    </div>
  );
};
