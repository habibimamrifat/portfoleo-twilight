"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BlogViewButtonProps {
  blogId: string;
  isAdmin?: boolean;
}

export default function BlogViewButton({
  blogId,
  isAdmin = false,
}: BlogViewButtonProps) {
  const href = isAdmin
    ? `blog/${blogId}`
    : `portfolio/blog/${blogId}`;

  return (
    <Link
      href={href}
      className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
      title={isAdmin ? "View blog in dashboard" : "View blog"}
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