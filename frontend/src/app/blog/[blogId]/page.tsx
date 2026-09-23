"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import BlogCommentList from "@/components/common/blog/BlogCommentList";
import WriteBlogComment from "@/components/common/blog/WriteBlogComment";

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
};

type BlogPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

export default function BlogPostPage({
  params,
}: BlogPageProps) {
  const { blogId } = use(params);

  const [post, setPost] =
    useState<BlogPost | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshComments, setRefreshComments] =
    useState(0);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setError(null);

        const response = await getApi(
          `/blog-posts/blog/${blogId}`,
        );

        if (!response.ok) {
          setError(
            "Failed to load blog post.",
          );
          return;
        }

        const result = await response.json();

        const blog =
          result?.data?.data ?? result?.data;

        setPost(blog);
      } catch (error) {
        console.error(
          "Failed to load blog:",
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

    loadBlog();
  }, [blogId]);

  const handleCommentSubmitted = () => {
    setRefreshComments(
      (previous) => previous + 1,
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-white/50">
            <Loader2
              size={20}
              className="animate-spin"
            />
            <span>Loading blog...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Card className="w-full max-w-lg p-8 text-center">
            <h1 className="text-xl font-semibold text-white">
              Blog post not found
            </h1>

            <p className="mt-3 text-sm text-white/40">
              {error ||
                "Unable to load this blog post."}
            </p>

            <Link
              href="/portfolio#blog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const publishedDate =
    post.publishedAt || post.createdAt;

  return (
    <main className="h-screen px-6 py-16 lg:px-10">
    <div>
        <article className="mx-auto max-w-4xl">
        <Link
          href="/portfolio#blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {post.coverImage && (
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[16/7] w-full">
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

        <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-white/35">
          <CalendarDays size={14} />

          <time dateTime={publishedDate}>
            {new Date(
              publishedDate,
            ).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {post.excerpt && (
          <p className="mt-6 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
            {post.excerpt}
          </p>
        )}

        <Card className="mt-8 p-6 sm:p-8">
          <div className="whitespace-pre-wrap text-sm leading-8 text-white/70 sm:text-base">
            {post.content}
          </div>
        </Card>



        <div className="mt-10 mb-60">
          <BlogCommentList
            blogId={post.id}
            isAdmin={false}
            refreshTrigger={refreshComments}
          />
        </div>

        <div className="mt-8 pb-16 fixed bottom-0 z-50">
          <WriteBlogComment
            blogId={post.id}
            onCommentSubmitted={
              handleCommentSubmitted
            }
          />
        </div>


      </article>
    </div>
    </main>
  );
}