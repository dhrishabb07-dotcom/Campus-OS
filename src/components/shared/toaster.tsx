"use client";

import { Toaster as Sonner } from "sonner";

/**
 * CampusOS Toast System (Sonner)
 *
 * Positioned bottom-right on desktop, bottom-center on mobile.
 * Minimal styling — semantic color cues only.
 */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "var(--bg-base)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-DEFAULT)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-sans)",
          boxShadow: "var(--shadow-lg)",
        },
        className: "campus-toast",
        duration: 4000,
      }}
    />
  );
}
