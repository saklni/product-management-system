"use client";

import { useEffect, useState } from "react";
import type { ToastState } from "@/types";

/** Renders a fixed top-right toast. Pass the state from useToast(). */
export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-sm text-sm font-medium text-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-slide-in ${
        isSuccess ? "bg-success" : "bg-danger"
      }`}
    >
      {isSuccess ? "✓" : "✕"} {toast.message}
    </div>
  );
}

/** Shows a toast for 3s then clears it automatically. */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast: setToast };
}
