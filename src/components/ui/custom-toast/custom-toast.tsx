"use client";

import { useEffect, useRef } from "react";

import { AlertTriangle, Check, CircleAlert, Info, X } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

import type { ToastItem } from "./custom-toast.types";

gsap.registerPlugin(useGSAP);

interface CustomToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

export default function CustomToast({ toast, onRemove }: CustomToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const close = () => {
    if (!toastRef.current) {
      onRemove(toast.id);
      return;
    }

    gsap.to(toastRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => onRemove(toast.id),
    });
  };

  useGSAP(
    () => {
      if (!toastRef.current) return;

      gsap.fromTo(
        toastRef.current,
        {
          opacity: 0,
          y: -18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
      );

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          {
            scaleX: 1,
          },
          {
            scaleX: 0,
            duration: (toast.duration ?? 3500) / 1000,
            ease: "none",
            transformOrigin: "left center",
          },
        );
      }
    },
    {
      scope: toastRef,
    },
  );

  useEffect(() => {
    const timeout = window.setTimeout(close, toast.duration ?? 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const icon = {
    success: <Check size={18} strokeWidth={2} />,
    error: <CircleAlert size={18} strokeWidth={2} />,
    info: <Info size={18} strokeWidth={2} />,
    warning: <AlertTriangle size={18} strokeWidth={2} />,
  }[toast.type];

  return (
    <div
      ref={toastRef}
      role="status"
      className={cn(
        "border-border bg-card relative w-[360px] overflow-hidden border",
        "shadow-lg",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center border",
            toast.type === "success" &&
              "border-success/30 bg-success/10 text-success",
            toast.type === "error" &&
              "border-destructive/30 bg-destructive/10 text-destructive",
            toast.type === "info" && "border-info/30 bg-info/10 text-info",
            toast.type === "warning" &&
              "border-warning/30 bg-warning/10 text-warning",
          )}
        >
          {icon}
        </div>

        <p className="text-foreground flex-1 pt-1 text-sm leading-6">
          {toast.message}
        </p>

        <button
          type="button"
          onClick={close}
          className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200"
        >
          <X size={17} strokeWidth={1.8} />
        </button>
      </div>

      <span
        ref={progressRef}
        className={cn(
          "absolute inset-x-0 bottom-0 h-[2px]",
          toast.type === "success" && "bg-success",
          toast.type === "error" && "bg-destructive",
          toast.type === "info" && "bg-info",
          toast.type === "warning" && "bg-warning",
        )}
      />
    </div>
  );
}
