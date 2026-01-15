// ============================================================
// frontend/src/components/FileUploader.jsx
// 文件上传组件
// ============================================================

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export const FileUploader = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadProgress(0);
      await onUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">上传中...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">上传博客文档</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      <p className="text-xs text-gray-500 mt-2 text-center">
        支持 TXT, MD, PDF, DOCX 格式 (最大10MB)
      </p>

      {isUploading && uploadProgress > 0 && (
        <div className="mt-3">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            >
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
