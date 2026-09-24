"use client";

import Image from "next/image";
import Card from "../util/Card";
import BlogViewButton from "./BlogViewButton";
import BlogActions from "./BlogActions";



export type BlogStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  blog: Blog;
  isAdmin?: boolean;
  refreshBlogList?: () => void;
}

const getImageUrl = (
  image?: string | null,
): string | null => {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
};

const formatDate = (
  date?: string | null,
) => {
  if (!date) {
    return "Not published";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
};

export default function BlogCard({
  blog,
  isAdmin = false,
  refreshBlogList,
}: BlogCardProps) {
  const imageUrl = getImageUrl(
    blog.coverImage,
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        {/* =====================================================
            IMAGE
            ===================================================== */}

        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:w-36">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={
                blog.title || "Blog cover"
              }
              fill
              unoptimized
              className="object-cover"
              sizes="144px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-white/20">
                No image
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            CONTENT
            ===================================================== */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-medium text-white">
              {blog.title}
            </h3>

            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
              {blog.status}
            </span>
          </div>

          <p className="mt-1 text-xs text-white/30">
            /{blog.slug}
          </p>

          {blog.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm text-white/45">
              {blog.excerpt}
            </p>
          ) : blog.content ? (
            <p className="mt-2 line-clamp-2 text-sm text-white/35">
              {blog.content}
            </p>
          ) : null}

          <p className="mt-2 text-xs text-white/30">
            {blog.status === "PUBLISHED"
              ? `Published ${formatDate(
                  blog.publishedAt,
                )}`
              : `Created ${formatDate(
                  blog.createdAt,
                )}`}
          </p>
        </div>

        {/* =====================================================
            ACTIONS
            ===================================================== */}

        <div className="flex shrink-0 gap-2">
          {/* VIEW BLOG */}

          <BlogViewButton
            blogId={blog.id}
            isAdmin={isAdmin}
          />

          {/* ADMIN ACTIONS */}

          {isAdmin && refreshBlogList && (
            <BlogActions
              blogId={blog.id}
              refreshParent={refreshBlogList}
            />
          )}
        </div>
      </div>
    </Card>
  );
}