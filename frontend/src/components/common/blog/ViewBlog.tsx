"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Loader2,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import BlogCommentList from "./blog-comments/BlogCommentList";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ViewBlogProps {
  blogId: string;
  isAdmin?: boolean;
}

export default function ViewBlog({
  blogId,
  isAdmin = false,
}: ViewBlogProps) {
  const [blog, setBlog] = useState<Blog | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     FETCH BLOG
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * ADMIN
         * GET /blog-posts/:id
         *
         * Returns the blog regardless of status.
         *
         * PUBLIC
         * GET /blog-posts/blog/:id
         *
         * Returns published blogs only.
         */

        const endpoint = isAdmin
          ? `/blog-posts/${blogId}`
          : `/blog-posts/blog/${blogId}`;

        const response = await getApi(
          endpoint,
          isAdmin,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch blog post",
          );
        }

        if (cancelled) {
          return;
        }

        const rawBlog =
          result?.data?.data ??
          result?.data ??
          result;

        if (
          !rawBlog ||
          typeof rawBlog !== "object"
        ) {
          throw new Error(
            "Invalid blog post response",
          );
        }

        setBlog(rawBlog as Blog);
      } catch (error) {
        console.error(
          "Failed to fetch blog post:",
          error,
        );

        if (!cancelled) {
          setBlog(null);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch blog post",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [blogId, isAdmin]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Loader2
            size={17}
            className="animate-spin"
          />

          Loading blog...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !blog) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 text-center">
        <FileText
          size={32}
          strokeWidth={1.5}
          className="mb-3 text-white/20"
        />

        <p className="text-sm text-white/50">
          {error || "Blog post not found."}
        </p>
      </Card>
    );
  }

  /* =========================================================
     BLOG DATA
     ========================================================= */

  const formattedDate = new Date(
    blog.createdAt,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedPublishedDate =
    blog.publishedAt
      ? new Date(
          blog.publishedAt,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  const wordCount = blog.content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200),
  );

  /* =========================================================
     RENDER BLOG
     ========================================================= */

  return (
    <article className="space-y-6">
      {/* HEADER */}

      <Card className="overflow-hidden">
        {/* COVER IMAGE */}

        {blog.coverImage && (
          <div className="relative aspect-[16/7] w-full overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* BLOG HEADER */}

        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
              {blog.status}
            </span>

            {blog.slug && (
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/30">
                /{blog.slug}
              </span>
            )}
          </div>

          <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-4xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50 md:text-lg">
              {blog.excerpt}
            </p>
          )}

          {/* META */}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-sm text-white/35">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                strokeWidth={1.6}
              />

              <span>
                {formattedPublishedDate ??
                  formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3
                size={16}
                strokeWidth={1.6}
              />

              <span>
                {readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FileText
                size={16}
                strokeWidth={1.6}
              />

              <span>
                {wordCount} words
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* CONTENT */}

      <Card className="p-6 md:p-8">
        <div className="whitespace-pre-wrap break-words text-[15px] leading-8 text-white/70 md:text-base">
          {blog.content}
        </div>
      </Card>

      <BlogCommentList
  blogId={blog.id}
  isAdmin={isAdmin}
/>
    </article>
  );
}