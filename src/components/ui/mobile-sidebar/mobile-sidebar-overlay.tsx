"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface MobileSidebarOverlayProps {
  onClose: () => void;

  className?: string;
}

export function MobileSidebarOverlay({
  onClose,
  className,
}: MobileSidebarOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm",
        className,
      )}
    />
  );
}
