"use client";

import { useEffect, useCallback } from "react";

type KeyboardModifiers = {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type KeyboardShortcutOptions = KeyboardModifiers & {
  /** If true, prevents the default browser action */
  preventDefault?: boolean;
  /** If true, fires even when focus is inside an input/textarea */
  allowInInputs?: boolean;
};

/**
 * Register a keyboard shortcut globally.
 * Handles both macOS (meta) and Windows/Linux (ctrl) patterns.
 *
 * @example
 * // Cmd/Ctrl+K
 * useKeyboardShortcut("k", handler, { ctrl: true, meta: true });
 *
 * // Escape key
 * useKeyboardShortcut("Escape", handler);
 */
export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {},
): void {
  const {
    ctrl = false,
    meta = false,
    shift = false,
    alt = false,
    preventDefault = true,
    allowInInputs = false,
  } = options;

  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      // Block shortcut when typing in inputs (unless explicitly allowed)
      if (!allowInInputs) {
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      const keyMatches =
        event.key.toLowerCase() === key.toLowerCase() ||
        event.key === key;

      const modifiersMatch =
        (!ctrl || event.ctrlKey) &&
        (!meta || event.metaKey) &&
        (!shift || event.shiftKey) &&
        (!alt || event.altKey);

      // For Cmd/Ctrl+K style shortcuts: match either ctrl or meta
      const cmdCtrlMatch =
        ctrl && meta
          ? event.ctrlKey || event.metaKey
          : modifiersMatch;

      if (keyMatches && (ctrl && meta ? cmdCtrlMatch : modifiersMatch)) {
        if (preventDefault) event.preventDefault();
        stableHandler(event);
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [key, ctrl, meta, shift, alt, preventDefault, allowInInputs, stableHandler]);
}
