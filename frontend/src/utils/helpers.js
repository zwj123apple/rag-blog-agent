// ============================================================
// frontend/src/utils/helpers.js
// 工具函数
// ============================================================

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * 格式化时间
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 验证文件类型
 */
export const isValidFileType = (filename) => {
  const validExtensions = [".txt", ".md", ".pdf", ".docx", ".doc"];
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  return validExtensions.includes(ext);
};

/**
 * 截断文本
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
