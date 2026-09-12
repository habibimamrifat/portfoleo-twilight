import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/20
        bg-transparent
        backdrop-blur-xs
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}