import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

const Toast: React.FC<ToastProps> = ({ message, type = "info" }) => {
  const base =
    "fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in z-50";
  const colors =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return <div className={`${base} ${colors}`}>{message}</div>;
};

export default Toast;
