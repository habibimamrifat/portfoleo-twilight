
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, ImagePlus } from "lucide-react";

import Card from "../common/Card";
import { getApi } from "@/api/getapi";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        const response = await getApi(
          "/blog-posts",
        );

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch blog posts",
          );
        }

        const blogData: Blog[] =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : [];

        setPosts(blogData);
      } catch (error) {
        console.error(
          "Failed to fetch blog posts:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (
    date?: string | null,
  ) => {
    if (!date) return "";

    return new Date(
      date,
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Blog
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Things Im learning.
          </h2>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-white/40">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-sm text-white/40">
            No blog posts available.
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="p-7 transition duration-300 hover:bg-white/10"
              >
                <div className="flex items-start gap-5">
                  {/* COVER IMAGE */}

                  {post.coverImage ? (
                    <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:block">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ) : (
                    <div className="hidden h-24 w-32 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:flex">
                      <ImagePlus
                        size={22}
                        className="text-white/20"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/40">
                      {formatDate(
                        post.publishedAt,
                      )}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-6 text-white/50">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
                    >
                      See more
                      <ArrowUpRight
                        size={15}
                      />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
