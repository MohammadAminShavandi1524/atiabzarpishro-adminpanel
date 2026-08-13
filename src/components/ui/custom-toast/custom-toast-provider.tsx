"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

import CustomToast from "./custom-toast";

import type {
  ToastContextValue,
  ToastItem,
  ToastType,
} from "./custom-toast.types";

export const ToastContext = createContext<ToastContextValue | null>(null);

interface CustomToastProviderProps {
  children: ReactNode;
}

export function CustomToastProvider({ children }: CustomToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info", duration = 3500) => {
      const id = crypto.randomUUID();

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
          duration,
        },
      ]);
    },
    [],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      remove,

      success: (message, duration) => show(message, "success", duration),

      error: (message, duration) => show(message, "error", duration),

      info: (message, duration) => show(message, "info", duration),

      warning: (message, duration) => show(message, "warning", duration),
    }),
    [show, remove],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-5 z-[10000] flex flex-col items-center gap-2.5 px-4">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <CustomToast toast={toast} onRemove={remove} />
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
