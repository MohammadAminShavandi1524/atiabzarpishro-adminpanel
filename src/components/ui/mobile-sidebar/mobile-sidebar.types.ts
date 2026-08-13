import { ReactNode } from "react";

export interface MobileSidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MobileSidebarProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface MobileSidebarContentProps {
  children: ReactNode;

  width?: number | string;

  className?: string;

  overlayClassName?: string;
}