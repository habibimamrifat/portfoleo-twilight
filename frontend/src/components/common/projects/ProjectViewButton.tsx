"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectViewButtonProps {
  projectId: string;
  isAdmin?: boolean;
}

export default function ProjectViewButton({
  projectId,
  isAdmin = false,
}: ProjectViewButtonProps) {
  const href = isAdmin
    ? `/dashboard/projects/${projectId}`
    : `/portfolio/projects/${projectId}`;

  return (
    <Link
      href={href}
      className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
      title={
        isAdmin
          ? "View project in dashboard"
          : "View project"
      }
    >
      <ArrowUpRight
        size={16}
        strokeWidth={1.6}
      />

      <span className="hidden sm:inline">
        See More
      </span>
    </Link>
  );
}