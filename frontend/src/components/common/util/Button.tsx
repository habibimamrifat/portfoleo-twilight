
import { hexToRgba } from "@/util/color";
import Link from "next/link";
import React from "react";


interface ButtonSettings {
  color?: string;
}

interface CustomButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: "default" | "none";
  settings?: ButtonSettings;
}

export default function CustomButton({
  children,
  href,
  onClick,
  type = "button",
  style = "default",
  settings,
}: CustomButtonProps) {
  const buttonColor = hexToRgba(
    settings?.color ?? "#ffffff",
    0.1,
  );

  const className =
    style === "none"
      ? "block transform transition-transform duration-300 ease-out hover:scale-[1.5]"
      : `
        rounded-xl
        min-w-[200px]
        min-h-[40px]
        flex
        justify-center
        items-center
        my-2
        backdrop-blur-xs
        shadow-lg
        ring-0
        transform
        transition-transform
        duration-300
        ease-out
        hover:scale-[1.5]
      `;

  const buttonStyle =
    style === "default"
      ? {
          backgroundColor: buttonColor,
        }
      : undefined;

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        style={buttonStyle}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={buttonStyle}
    >
      {children}
    </button>
  );
}

