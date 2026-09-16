import { hexToRgba } from "@/util/color";
import React from "react";

interface CardSettings {
  color?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  settings?: CardSettings;
}

export default function Card({
  children,
  className = "",
  settings,
}: CardProps) {
  const cardColor = hexToRgba(
    settings?.color ?? "#ffffff",
    0.1,
  );

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/20
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        ${className}
      `}
      style={{
        backgroundColor: cardColor,
      }}
    >
      {/* Glass highlight */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
        "
      />

      {children}
    </div>
  );
}