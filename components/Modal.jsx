"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([tabindex="-1"]):not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dialog sederhana: Esc menutup, Tab berputar di dalam dialog, fokus dikembalikan saat ditutup.
export default function Modal({ labelledBy, onClose, dismissible = true, children }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    const node = ref.current;
    const first = node?.querySelector("[data-autofocus]") || node?.querySelector(FOCUSABLE);
    first?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape" && dismissible) {
        event.stopPropagation();
        onCloseRef.current?.();
      }
      if (event.key === "Tab" && node) {
        const items = [...node.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [dismissible]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (dismissible && event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={ref}>
        {children}
      </div>
    </div>
  );
}
