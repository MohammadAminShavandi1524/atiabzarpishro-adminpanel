"use client";

import { ReactNode } from "react";

interface MobileSidebarFooterProps {
  children: ReactNode;
}

export function MobileSidebarFooter({
  children,
}: MobileSidebarFooterProps) {
  return (
    <footer className="border-t-border border-t px-6 py-5">
      {children}
    </footer>
  );
}