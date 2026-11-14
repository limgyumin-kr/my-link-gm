"use client";

import React, { useEffect } from "react";
import { Check } from "@/components/icons";

interface SnackbarProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Snackbar({ message, onClose, duration = 2500 }: SnackbarProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-[#141A24] text-white px-4 py-2.5 rounded-[12px] shadow-lg flex items-center gap-2 text-xs font-semibold max-w-[90vw]">
        <Check className="w-4 h-4 text-[#04CA81] shrink-0" />
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
}
