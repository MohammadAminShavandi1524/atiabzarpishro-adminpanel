export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void;

  success: (message: string, duration?: number) => void;

  error: (message: string, duration?: number) => void;

  info: (message: string, duration?: number) => void;

  warning: (message: string, duration?: number) => void;

  remove: (id: string) => void;
}
