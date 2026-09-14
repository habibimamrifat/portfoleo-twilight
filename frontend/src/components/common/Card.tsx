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
        rounded-2xl
        backdrop-blur-xs
        shadow-lg
        ${className}
      `}
      style={{
        backgroundColor: cardColor,
        border: "1px solid rgba(255, 255, 255, 0.20)",
      }}
    >
      {children}
    </div>
  );
}