"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  BriefcaseBusiness,
  FolderKanban,
  History,
  Workflow,
  Layers3,
  GraduationCap,
  BookOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navigation = [
  // {
  //   name: "Dashboard",
  //   href: "/dashboard",
  //   icon: LayoutDashboard,
  // },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "System Settings",
    href: "/dashboard/system",
    icon: Settings,
  },
  {
    name: "Services",
    href: "/dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    name: "Experience",
    href: "/dashboard/experience",
    icon: History,
  },
  {
    name: "Process",
    href: "/dashboard/process",
    icon: Workflow,
  },
  {
    name: "Stack",
    href: "/dashboard/tools",
    icon: Layers3,
  },
  {
    name: "Blog",
    href: "/dashboard/blog",
    icon: BookOpen,
  },

];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative h-screen w-full overflow-hidden p-6">
      <div className="flex h-full w-full gap-6">

        {/* =====================================================
            NAVIGATION
            Fixed height - does not scroll
            ===================================================== */}
        <div
          className="
            flex
            h-full
            w-20
            shrink-0
            flex-col
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-3xl
            border
            border-white/20
            bg-white/5
            p-3
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
          "
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                title={item.name}
                className={`
                  group
                  relative
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  transition-all
                  duration-300
                  ${
                    active
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-transparent text-white/50 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.7}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    left-14
                    z-50
                    whitespace-nowrap
                    rounded-lg
                    border
                    border-white/10
                    bg-black/70
                    px-3
                    py-1.5
                    text-xs
                    text-white
                    opacity-0
                    backdrop-blur-xl
                    transition-opacity
                    duration-200
                    group-hover:opacity-100
                  "
                >
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-2 h-px w-7 shrink-0 bg-white/10" />

          {/* Logout */}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("portfolio");
              window.location.href = "/login";
            }}
            title="Logout"
            className="
              group
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-transparent
              text-white/50
              transition-all
              duration-300
              hover:border-white/20
              hover:bg-white/10
              hover:text-white
            "
          >
            <LogOut
              size={19}
              strokeWidth={1.7}
            />

            <span
              className="
                pointer-events-none
                absolute
                left-14
                z-50
                whitespace-nowrap
                rounded-lg
                border
                border-white/10
                bg-black/70
                px-3
                py-1.5
                text-xs
                text-white
                opacity-0
                backdrop-blur-xl
                transition-opacity
                duration-200
                group-hover:opacity-100
              "
            >
              Logout
            </span>
          </button>
        </div>

        {/* =====================================================
            OUTLET
            Only this area is scrollable
            ===================================================== */}
        <div
          className="
            min-w-0
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            pr-2
          "
        >
          {children}
        </div>

      </div>
    </div>
  );
}