"use client";

import { createContext } from "react";

import { MobileSidebarContextValue } from "./mobile-sidebar.types";

export const MobileSidebarContext =
  createContext<MobileSidebarContextValue | null>(null);