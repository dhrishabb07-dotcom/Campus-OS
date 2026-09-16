"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "campus-os:sidebar-collapsed";

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Default to false (expanded). Read from localStorage after mount to avoid hydration mismatch.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setIsCollapsed(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  // Suppress hydration mismatch — render with default until mounted
  if (!mounted) {
    return (
      <SidebarContext.Provider value={{ isCollapsed: false, toggle, setCollapsed }}>
        {children}
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, setCollapsed }}>
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
