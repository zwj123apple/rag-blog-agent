// ============================================================
// frontend/src/components/FileUploader.jsx
// 文件上传组件
// ============================================================

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export const FileUploader = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(""); // 'uploading' | 'processing' | 'complete'

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📤 开始上传文件:", file.name);
      setUploadProgress(0);
      setUploadStatus("uploading");

      try {
        await onUpload(file, (progress) => {
          console.log("📊 上传进度:", progress + "%");
          setUploadProgress(progress);

          // 根据进度更新状态文本
          if (progress <= 60) {
            setUploadStatus("uploading");
          } else if (progress > 60 && progress < 100) {
            setUploadStatus("processing");
          }
        });

        // 上传完成 - 先设置完成状态，再设置进度100
        console.log("✅ 上传完成");
        setUploadStatus("complete");
        setUploadProgress(100);

        // 延迟重置，让用户看到完成状态
        setTimeout(() => {
          setUploadProgress(0);
          setUploadStatus("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 1500);
      } catch (error) {
        console.error("❌ 上传失败:", error);
        setUploadStatus("error");
        setTimeout(() => {
          setUploadProgress(0);
          setUploadStatus("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 2000);
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <label
        className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition-all shadow-md select-none ${
          isUploading
            ? "cursor-not-allowed opacity-80"
            : "cursor-pointer hover:from-blue-700 hover:to-indigo-700"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium select-none">上传中...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium select-none">
              上传博客文档
            </span>
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
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-700">
              {uploadStatus === "uploading" && "📤 正在上传文件..."}
              {uploadStatus === "processing" && "⚙️ 正在处理文档..."}
              {uploadStatus === "complete" && "✅ 上传完成！"}
              {uploadStatus === "error" && "❌ 上传失败"}
            </span>
            <span className="text-xs font-semibold text-blue-600">
              {uploadProgress}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
