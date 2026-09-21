"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
} from "lucide-react";

import Card from "@/components/common/Card";
import BlogCommentList from "@/components/common/BlogCommentList";
import WriteBlogComment from "@/components/common/WriteBlogComment";

import { getApi } from "@/api/getapi";

type BlogPost = {
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
};

type BlogPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

export default function BlogPostPage({
  params,
}: BlogPageProps) {
  const [post, setPost] =
    useState<BlogPost | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { blogId } = await params;

        console.log("Blog ID:", blogId);

        if (!blogId) {
          throw new Error(
            "Blog post ID is missing from the URL.",
          );
        }

        const response = await getApi(
          `/blog-posts/blog/${blogId}`,
        );

        console.log(
          "Blog response:",
          response,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load blog post.",
          );
        }

        const result =
          await response.json();

        console.log(
          "FULL BLOG RESULT:",
          result,
        );

        console.log(
          "BLOG DATA:",
          result?.data,
        );

        if (!result?.data) {
          throw new Error(
            "Blog post data was not returned by the server.",
          );
        }

        setPost(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch blog post:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load blog post.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  /*
   * =========================
   * LOADING
   * =========================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-white/50">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading article...
        </div>
      </main>
    );
  }

  /*
   * =========================
   * ERROR
   * =========================
   */

  if (error || !post) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-lg p-8 text-center">
          <h1 className="text-xl font-semibold text-white">
            Blog post not found
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {error ||
              "The article you're looking for doesn't exist."}
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />

            Back to Blog
          </Link>
        </Card>
      </main>
    );
  }

  const publishedDate =
    post.publishedAt ||
    post.createdAt;

  /*
   * =========================
   * BLOG PAGE
   * =========================
   */

  return (
    <main className="px-6 py-20 lg:px-10">
      <article className="mx-auto max-w-4xl">

        {/* Back */}

        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />

          Back to Blog
        </Link>

        {/* Header */}

        <header>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <CalendarDays size={15} />

            <time dateTime={publishedDate}>
              {new Date(
                publishedDate,
              ).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </time>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}

        {post.coverImage && (
          <Card className="mt-10 overflow-hidden p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </Card>
        )}

        {/* Content */}

        <Card className="mt-10 p-6 sm:p-8 lg:p-10">
          <div className="whitespace-pre-wrap text-sm leading-8 text-white/70 sm:text-base">
            {post.content}
          </div>
        </Card>

        {/* Comments */}

        <div className="mt-14">
          <BlogCommentList
            blogId={post.id}
            isAdmin={false}
          />

          <WriteBlogComment
            blogId={post.id}
          />
        </div>
      </article>
    </main>
  );
}