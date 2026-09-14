
"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useApp } from "../context/AppContext";
import { hexToRgba } from "@/util/color";


interface TopNavigationSettings {
  color?: string;
}

interface TopNavigationProps {
  settings?: TopNavigationSettings;
}

export default function TopNavigation({
  settings,
}: TopNavigationProps) {
  const { openSideNav } = useApp();

  const navigationColor = hexToRgba(
    settings?.color ?? "#ffffff",
    0.1,
  );

  return (
    <nav
      className="
        absolute
        left-0
        top-0
        z-50
        mx-auto
        mb-2
        flex
        w-full
        items-center
        justify-between
        rounded-b-2xl
        px-6
        py-3
        backdrop-blur-xs
        shadow-2xl
      "
      style={{
        backgroundColor: navigationColor,
      }}
    >
      {/* Profile */}
      <button
        type="button"
        className="flex items-center gap-3"
      >
        {/* Profile Image */}
        <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20">
          <Image
            src="/profilePic.jpg"
            alt="Habib Rifat"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-start">
          <h5 className="text-sm font-semibold text-white">
            Habib Rifat
          </h5>

          <span className="text-xs text-white/50">
            Full-Stack Developer
          </span>
        </div>
      </button>

      {/* Menu */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={openSideNav}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          backdrop-blur-md
          transition
          duration-300
          hover:bg-white/20
        "
        style={{
          backgroundColor: navigationColor,
        }}
      >
        <Menu
          size={22}
          strokeWidth={1.8}
        />
      </button>
    </nav>
  );
}
