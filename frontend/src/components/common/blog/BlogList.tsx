"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { getApi } from "@/api/getapi";

import BlogCard, {
  type Blog,
} from "./EachBlogCard";

interface BlogListProps {
  isAdmin?: boolean;
}

export default function BlogList({
  isAdmin = false,
}: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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
    ).toUpperCase() as Blog["status"];

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
          : "",

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
     EXTRACT BLOG POSTS
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
          container as Record<
            string,
            unknown
          >;

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
     FETCH BLOG POSTS
     ========================================================= */

  const fetchBlogs = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        /*
         * PUBLIC
         * GET /blog-posts
         *
         * Returns only PUBLISHED blogs.
         *
         * ADMIN
         * GET /blog-posts/admin/all
         *
         * Returns ALL blogs:
         * DRAFT
         * PUBLISHED
         * ARCHIVED
         */

        const endpoint = isAdmin
          ? "/blog-posts/admin/all"
          : "/blog-posts";

        const response = await getApi(
          endpoint,
          isAdmin,
        );

        const result =
          await response.json();

        console.log(
          "BLOG POSTS API RESPONSE:",
          result,
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch blog posts",
          );
        }

        const blogData =
          extractBlogs(result);

        /*
         * Newest posts first
         */

        blogData.sort((a, b) => {
          const dateA = new Date(
            a.createdAt,
          ).getTime();

          const dateB = new Date(
            b.createdAt,
          ).getTime();

          return dateB - dateA;
        });

        console.log(
          "NORMALIZED BLOG POSTS:",
          blogData,
        );

        setBlogs(blogData);
      } catch (error) {
        console.error(
          "Failed to fetch blog posts:",
          error,
        );

        setBlogs([]);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [isAdmin],
  );

  /* =========================================================
     REFRESH BLOG LIST
     Used by edit/delete components
     ========================================================= */

  const refreshBlogList = useCallback(
    async () => {
      await fetchBlogs(false);
    },
    [fetchBlogs],
  );

  /* =========================================================
     INITIAL FETCH
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      try {
        const endpoint = isAdmin
          ? "/blog-posts/admin/all"
          : "/blog-posts";

        const response = await getApi(
          endpoint,
          isAdmin,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch blog posts",
          );
        }

        if (cancelled) {
          return;
        }

        const blogData =
          extractBlogs(result);

        blogData.sort((a, b) => {
          const dateA = new Date(
            a.createdAt,
          ).getTime();

          const dateB = new Date(
            b.createdAt,
          ).getTime();

          return dateB - dateA;
        });

        setBlogs(blogData);
      } catch (error) {
        console.error(
          "Failed to fetch blog posts:",
          error,
        );

        if (!cancelled) {
          setBlogs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  /* =========================================================
     RENDER
     ========================================================= */

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-white/40">
        <Loader2
          size={16}
          className="animate-spin"
        />

        Loading posts...
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          isAdmin={isAdmin}
          refreshBlogList={refreshBlogList}
        />
      ))}
    </div>
  );
}