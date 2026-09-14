
"use client";

import { hexToRgba } from "@/util/color";
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";


interface PopupCardSettings {
  color?: string;
}

interface PopupCardProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  settings?: PopupCardSettings;
}

export default function PopupCard({
  isOpen,
  onClose,
  children,
  settings,
}: PopupCardProps) {
  if (!isOpen) return null;

  const popupColor = hexToRgba(
    settings?.color ?? "#ffffff",
    0.1,
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent">
      {/* Popup */}
      <div
        className="
          relative
          h-[85vh]
          w-[85vw]
          overflow-hidden
          rounded-4xl
          border
          border-white/10
          backdrop-blur-xs
          shadow-2xl
          shadow-white/20
        "
        style={{
          backgroundColor: popupColor,
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white
            bg-white/20
            text-white/70
            backdrop-blur-md
            transition
            hover:bg-white/20
            hover:text-white
            hover:scale-125
          "
        >
          ×
        </button>

        {/* Content */}
        <div className="flex h-full w-full justify-center overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
