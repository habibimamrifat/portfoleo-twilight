"use client";

import Link from "next/link";
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
} from "lucide-react";

import CustomButton from "./common/util/Button";
import Card from "./common/util/Card";

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

export default function Navbar() {
  return (
    <div className="hidden xl:block">
      <nav className="mx-auto flex h-20 flex-col items-center justify-between px-6 lg:px-8">
        <Link
          href="#home"
          className="text-xl font-bold tracking-tight"
        />

        <div className="flex flex-col items-center gap-2">
          <Card className="min-h-[50vh] w-[80px] rounded-full p-2 py-5 shadow-2xl">
            <div className="flex h-full flex-col items-center justify-between">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <CustomButton
                    key={item.name}
                    href={item.href}
                    style="none"
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className="text-current"
                    />
                  </CustomButton>
                );
              })}
            </div>
          </Card>
        </div>
      </nav>
    </div>
  );
}