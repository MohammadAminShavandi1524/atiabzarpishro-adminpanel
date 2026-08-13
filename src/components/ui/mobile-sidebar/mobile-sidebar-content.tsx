"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence } from "framer-motion";

import { MobileSidebarContentProps } from "./mobile-sidebar.types";
import { MobileSidebarOverlay } from "./mobile-sidebar-overlay";
import { MobileSidebarPanel } from "./mobile-sidebar-panel";
import { useMobileSidebar } from "./use-mobile-sidebar";

export function MobileSidebarContent({
  children,
  width = 320,
  className,
  overlayClassName,
}: MobileSidebarContentProps) {
  const { open, closeSidebar } = useMobileSidebar();

  const [mounted, setMounted] = useState(false);

  // Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body Scroll Lock
  useEffect(() => {
    if (!mounted) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = open ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, mounted]);

  // Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeSidebar]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <MobileSidebarOverlay
            onClose={closeSidebar}
            className={overlayClassName}
          />

          <MobileSidebarPanel width={width} className={className}>
            {children}
          </MobileSidebarPanel>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
