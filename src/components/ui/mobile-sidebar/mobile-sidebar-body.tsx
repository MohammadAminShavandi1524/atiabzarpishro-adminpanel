"use client";

import { ReactNode } from "react";

interface MobileSidebarBodyProps {
  children: ReactNode;
}

export function MobileSidebarBody({
  children,
}: MobileSidebarBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {children}
    </div>
  );
}