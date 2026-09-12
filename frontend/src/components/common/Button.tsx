import Link from "next/link";
import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: "default" | "none";
}

export default function CustomButton({
  children,
  href,
  onClick,
  type = "button",
  style = "default",
}: CustomButtonProps) {
  const className =
    style === "none"
      ? "block transform transition-transform duration-300 ease-out hover:scale-[1.5]"
      : "rounded-xl min-w-[200px] min-h-[40px] flex justify-center items-center my-2 backdrop-blur-xs bg-white/10 shadow-lg ring-0 transform transition-transform duration-300 ease-out hover:scale-[1.5]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}