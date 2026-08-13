"use client";

import { useContext } from "react";

import { MobileSidebarContext } from "./mobile-sidebar-context";

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);

  if (!context) {
    throw new Error(
      "useMobileSidebar must be used within MobileSidebar."
    );
  }

  const { open, setOpen } = context;

  return {
    open,
    setOpen,

    openSidebar: () => setOpen(true),

    closeSidebar: () => setOpen(false),

    toggleSidebar: () => setOpen((prev) => !prev),
  };
}