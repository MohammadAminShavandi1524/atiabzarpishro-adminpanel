"use client";

import { useState } from "react";

import { MobileSidebarContext } from "./mobile-sidebar-context";
import { MobileSidebarProps } from "./mobile-sidebar.types";

export function MobileSidebar({
  children,
  defaultOpen = false,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <MobileSidebarContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
}
