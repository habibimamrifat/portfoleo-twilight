"use client";

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Card from "./Card";

interface PopupCardProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function PopupCard({
  isOpen,
  onClose,
  children,
}: PopupCardProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center rounded-3xl overflow-hidden bg-transparent">
      {/* Popup */}
      <div
        className=" relative h-[85vh] w-[85vw] overflow-hidden backdrop-blur-xs shadow-2xl rounded-4xl shadow-white/20 border border-white/10"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white/20 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white hover:scale-125"
        >
          ×
        </button>

        {/* Content */}
        <div className="h-full w-full overflow-auto p-6 flex justify-center">
            {children}
        </div>
      </div>
    </div>,
    document.body
  );
}