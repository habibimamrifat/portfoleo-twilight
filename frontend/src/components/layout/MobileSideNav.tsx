
"use client";

import {
  House,
  User,
  BriefcaseBusiness,
  FolderKanban,
  History,
  Workflow,
  Layers3,
  MessageSquareQuote,
  BookOpen,
  Mail,
  X,
} from "lucide-react";


import { hexToRgba } from "@/util/color";
import { useApp } from "@/components/context/AppContext";
import CustomButton from "../common/util/Button";


interface MobileSideNavSettings {
  color?: string;
}

interface MobileSideNavProps {
  settings?: MobileSideNavSettings;
}

const navItems = [
  {
    name: "Home",
    href: "#home",
    icon: House,
  },
  {
    name: "About",
    href: "#about",
    icon: User,
  },
  {
    name: "Services",
    href: "#services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Projects",
    href: "#projects",
    icon: FolderKanban,
  },
  {
    name: "Experience",
    href: "#experience",
    icon: History,
  },
  {
    name: "Process",
    href: "#process",
    icon: Workflow,
  },
  {
    name: "Stack",
    href: "#stack",
    icon: Layers3,
  },
  {
    name: "Testimonials",
    href: "#testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Blog",
    href: "#blog",
    icon: BookOpen,
  },
  {
    name: "Contact",
    href: "#contact",
    icon: Mail,
  },
];

export default function MobileSideNav({
  settings,
}: MobileSideNavProps) {
  const { isSideNavOpen, closeSideNav } = useApp();

  const navigationColor = hexToRgba(
    settings?.color ?? "#ffffff",
    0.1,
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] xl:hidden ${
        isSideNavOpen
          ? "pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}

      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-1000 ease-in-out ${
          isSideNavOpen
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeSideNav}
          className="h-full w-full"
        />
      </div>

      {/* Side Navigation */}

      <aside
        className={`absolute right-0 top-0 h-full w-[80vw] max-w-sm transform transition-transform duration-1000 ease-in-out ${
          isSideNavOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div
          className="
            h-full
            border-l
            border-white/20
            p-6
            backdrop-blur-xl
          "
          style={{
            backgroundColor: navigationColor,
          }}
        >
          {/* Header */}

          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              HABIB RIFAT
            </h2>

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeSideNav}
              className="
                flex
                h-10
                w-10
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
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <CustomButton
                  key={item.name}
                  href={item.href}
                  onClick={closeSideNav}
                  style="none"
                >
                  <div className="flex w-full items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className="text-current"
                    />

                    <span>{item.name}</span>
                  </div>
                </CustomButton>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

