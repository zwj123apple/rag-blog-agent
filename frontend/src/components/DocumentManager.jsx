// ============================================================
// frontend/src/components/DocumentManager.jsx
// 文档管理组件
// ============================================================

import React from "react";
import { FileText, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { ErrorAlert } from "./ErrorAlert";

export const DocumentManager = ({
  documents,
  onClear,
  onUpload,
  isUploading,
  isClearing,
  error,
  onClearError,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 文件上传区域 */}
      <FileUploader onUpload={onUpload} isUploading={isUploading} />

      {/* 错误提示 */}
      <div className="px-4 pt-4">
        <ErrorAlert error={error} onClose={onClearError} />
      </div>

      {/* 文档列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            已上传文档 ({documents.length})
          </h3>
          {documents.length > 0 && (
            <button
              onClick={onClear}
              disabled={isClearing || isUploading}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  清空中...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3" />
                  清空
                </>
              )}
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无文档</p>
            <p className="text-xs mt-1">上传文档开始使用</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {doc.filename}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span>{doc.chunk_count} 块</span>
                      <span>·</span>
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.upload_time).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
