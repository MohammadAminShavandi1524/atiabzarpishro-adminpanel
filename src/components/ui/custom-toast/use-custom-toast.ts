"use client";

import { useContext } from "react";

import { ToastContext } from "./custom-toast-provider";

export function useCustomToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useCustomToast must be used within CustomToastProvider");
  }

  return context;
}
