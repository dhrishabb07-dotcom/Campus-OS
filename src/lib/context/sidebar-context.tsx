"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "campus-os:sidebar-collapsed";

function readCollapsed() {
  try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("campus-os:sidebar", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("campus-os:sidebar", callback);
  };
}
function writeCollapsed(value: boolean) {
  try { localStorage.setItem(STORAGE_KEY, String(value)); } catch { /* localStorage may be unavailable */ }
  window.dispatchEvent(new Event("campus-os:sidebar"));
}
function toggleCollapsed() { writeCollapsed(!readCollapsed()); }
function setCollapsedValue(value: boolean) { writeCollapsed(value); }

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isCollapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle: toggleCollapsed, setCollapsed: setCollapsedValue }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
