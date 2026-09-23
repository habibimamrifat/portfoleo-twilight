"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, ImagePlus, Loader2 } from "lucide-react";

import Card from "../common/util/Card";
import { getApi } from "@/api/getapi";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

/* =========================================================
   NORMALIZE IMAGE URL
   ========================================================= */

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

/* =========================================================
   NORMALIZE BLOG
   ========================================================= */

const normalizeBlog = (
  raw: Record<string, unknown>,
  index: number,
): Blog => {
  const id =
    raw.id ??
    raw._id ??
    raw.blogId ??
    raw.blog_id ??
    `blog-${index}`;

  const title = String(
    raw.title ??
      raw.name ??
      "Untitled Blog",
  );

  const slug = String(
    raw.slug ??
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
  );

  const excerpt =
    raw.excerpt ??
    raw.summary ??
    raw.description ??
    null;

  const content =
    raw.content ??
    raw.body ??
    null;

  const coverImage =
    raw.coverImage ??
    raw.cover_image ??
    raw.image ??
    raw.imageUrl ??
    raw.image_url ??
    raw.thumbnail ??
    null;

  const publishedAt =
    raw.publishedAt ??
    raw.published_at ??
    null;

  const createdAt = String(
    raw.createdAt ??
      raw.created_at ??
      new Date().toISOString(),
  );

  const updatedAt =
    raw.updatedAt ??
    raw.updated_at ??
    createdAt;

  const status = String(
    raw.status ?? "PUBLISHED",
  ).toUpperCase();

  return {
    id: String(id),
    title,
    slug,
    excerpt:
      excerpt !== null &&
      excerpt !== undefined
        ? String(excerpt)
        : null,
    content:
      content !== null &&
      content !== undefined
        ? String(content)
        : null,
    coverImage:
      coverImage !== null &&
      coverImage !== undefined
        ? String(coverImage)
        : null,
    status,
    publishedAt:
      publishedAt !== null &&
      publishedAt !== undefined
        ? String(publishedAt)
        : null,
    createdAt,
    updatedAt: String(updatedAt),
  };
};

/* =========================================================
   EXTRACT BLOG POSTS FROM API RESPONSE
   ========================================================= */

const extractBlogs = (
  result: unknown,
): Blog[] => {
  if (Array.isArray(result)) {
    return result.map((item, index) =>
      normalizeBlog(
        item as Record<string, unknown>,
        index,
      ),
    );
  }

  if (
    !result ||
    typeof result !== "object"
  ) {
    return [];
  }

  const response =
    result as Record<string, unknown>;

  const containers = [
    response.data,
    response.blogs,
    response.posts,
    response.items,
    response.results,
  ];

  for (const container of containers) {
    if (Array.isArray(container)) {
      return container.map(
        (item, index) =>
          normalizeBlog(
            item as Record<string, unknown>,
            index,
          ),
      );
    }

    if (
      container &&
      typeof container === "object"
    ) {
      const nested =
        container as Record<string, unknown>;

      const nestedArrays = [
        nested.data,
        nested.blogs,
        nested.posts,
        nested.items,
        nested.results,
      ];

      for (const nestedArray of nestedArrays) {
        if (Array.isArray(nestedArray)) {
          return nestedArray.map(
            (item, index) =>
              normalizeBlog(
                item as Record<
                  string,
                  unknown
                >,
                index,
              ),
          );
        }
      }
    }
  }

  return [];
};

/* =========================================================
   BLOG COMPONENT
   ========================================================= */

export default function Blog() {
  const [posts, setPosts] = useState<Blog[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await getApi(
          "/blog-posts",
        );

        const result =
          await response.json();

        console.log(
          "BLOG POSTS API RESPONSE:",
          result,
        );

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch blog posts",
          );
        }

        const blogData =
          extractBlogs(result);

        /*
         * Show newest posts first.
         *
         * createdAt is used instead of publishedAt
         * because a newly created post may not have
         * publishedAt depending on the backend.
         */
        blogData.sort((a, b) => {
          const dateA =
            new Date(
              a.createdAt,
            ).getTime();

          const dateB =
            new Date(
              b.createdAt,
            ).getTime();

          return dateB - dateA;
        });

        console.log(
          "NORMALIZED BLOG POSTS:",
          blogData,
        );

        setPosts(blogData);
      } catch (error) {
        console.error(
          "Failed to fetch blog posts:",
          error,
        );

        if (!cancelled) {
          setPosts([]);
        }
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

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (
    date?: string | null,
  ) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* =================================================
            HEADER
            ================================================= */}

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Blog
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Things Im learning.
          </h2>
        </div>

        {/* =================================================
            LOADING
            ================================================= */}

        {loading ? (
          <div className="flex items-center gap-2 py-10 text-sm text-white/40">
            <Loader2
              size={16}
              className="animate-spin"
            />

            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          /* ===============================================
             EMPTY
             =============================================== */

          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ImagePlus
              size={28}
              className="mb-3 text-white/20"
              strokeWidth={1.5}
            />

            <p className="text-sm text-white/40">
              No blog posts available.
            </p>
          </div>
        ) : (
          /* ===============================================
             POSTS
             =============================================== */

          <div className="grid gap-4">
            {posts.map(
              (post, index) => {
                const imageUrl =
                  getImageUrl(
                    post.coverImage,
                  );

                /*
                 * Fallback key in case the backend
                 * unexpectedly does not return an id.
                 */
                const postKey =
                  post.id ||
                  `${post.slug}-${post.createdAt}-${index}`;

                return (
                  <Card
                    key={postKey}
                    className="p-7 transition duration-300 hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {/* =================================
                          COVER IMAGE
                          ================================= */}

                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:h-24 sm:w-32">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={
                              post.title ||
                              "Blog cover"
                            }
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImagePlus
                              size={22}
                              className="text-white/20"
                              strokeWidth={
                                1.5
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* =================================
                          CONTENT
                          ================================= */}

                      <div className="min-w-0 flex-1">
                        {/* DATE */}

                        <p className="text-xs text-white/40">
                          {formatDate(
                            post.publishedAt ||
                              post.createdAt,
                          )}
                        </p>

                        {/* TITLE */}

                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {post.title}
                        </h3>

                        {/* EXCERPT */}

                        {post.excerpt ? (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
                            {
                              post.excerpt
                            }
                          </p>
                        ) : post.content ? (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/40">
                            {post.content}
                          </p>
                        ) : null}

                        {/* STATUS */}

                        {post.status && (
                          <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/35">
                            {
                              post.status
                            }
                          </span>
                        )}

                        {/* SEE MORE */}

                        <div className="mt-4">
                          <Link
                            href={`/blog/${post.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                          >
                            See more

                            <ArrowUpRight
                              size={15}
                              strokeWidth={
                                1.7
                              }
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}