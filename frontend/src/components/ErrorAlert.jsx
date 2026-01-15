// ============================================================
// frontend/src/components/ErrorAlert.jsx
// 错误提示组件
// ============================================================

import React from "react";
import { AlertCircle, XCircle, Wifi, Clock, X } from "lucide-react";

export const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  // 根据错误类型选择图标和颜色
  const getErrorStyle = (type) => {
    switch (type) {
      case "network":
        return {
          icon: Wifi,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-500",
        };
      case "timeout":
        return {
          icon: Clock,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-500",
        };
      case "server":
      case "validation":
        return {
          icon: XCircle,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800",
          iconColor: "text-orange-500",
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-500",
        };
    }
  };

  const errorMessage = typeof error === "string" ? error : error.message;
  const errorDetails = typeof error === "object" ? error.details : null;
  const errorType = typeof error === "object" ? error.type : "unknown";

  const style = getErrorStyle(errorType);
  const Icon = style.icon;

  return (
    <div
      className={`${style.bgColor} ${style.borderColor} ${style.textColor} border rounded-lg p-4 mb-4 animate-fadeIn`}
      role="alert"
    >
      <div className="flex items-start">
        <Icon
          className={`${style.iconColor} w-5 h-5 mr-3 flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{errorMessage}</h3>
          {errorDetails && (
            <p className="text-xs whitespace-pre-line opacity-90">
              {errorDetails}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
