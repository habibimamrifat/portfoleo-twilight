
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Edit3,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface Blog {
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

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  publishedAt: string;
}

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  publishedAt: "",
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
    raw.description ??
    raw.summary ??
    null;

  const content = String(
    raw.content ??
      raw.body ??
      raw.description ??
      "",
  );

  const coverImage =
    raw.coverImage ??
    raw.cover_image ??
    raw.image ??
    raw.imageUrl ??
    raw.image_url ??
    raw.thumbnail ??
    null;

  const statusValue = String(
    raw.status ?? "DRAFT",
  ).toUpperCase();

  const status: BlogStatus =
    statusValue === "PUBLISHED" ||
    statusValue === "ARCHIVED"
      ? statusValue
      : "DRAFT";

  const publishedAt =
    raw.publishedAt ??
    raw.published_at ??
    null;

  const createdAt = String(
    raw.createdAt ??
      raw.created_at ??
      new Date().toISOString(),
  );

  const updatedAt = String(
    raw.updatedAt ??
      raw.updated_at ??
      createdAt,
  );

  return {
    id: String(id),
    title,
    slug,
    excerpt:
      excerpt !== null &&
      excerpt !== undefined
        ? String(excerpt)
        : null,
    content,
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
    updatedAt,
  };
};

/* =========================================================
   EXTRACT BLOG ARRAY FROM API RESPONSE
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
   IMAGE URL
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
   BLOG PAGE
   ========================================================= */

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] =
    useState<BlogForm>(emptyForm);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     LOAD BLOGS
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getApi(
          "/blog-posts/admin/all",
          true,
        );

        const result =
          await response.json();

        console.log(
          "BLOG API RESPONSE:",
          result,
        );

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load blog posts",
          );
        }

        const blogData =
          extractBlogs(result);

        console.log(
          "NORMALIZED BLOGS:",
          blogData,
        );

        setBlogs(blogData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load blog posts",
          );
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
  }, []);

  /* =========================================================
     STATS
     ========================================================= */

  const stats = useMemo(() => {
    return {
      total: blogs.length,

      published: blogs.filter(
        (blog) =>
          blog.status === "PUBLISHED",
      ).length,

      drafts: blogs.filter(
        (blog) =>
          blog.status === "DRAFT",
      ).length,

      archived: blogs.filter(
        (blog) =>
          blog.status === "ARCHIVED",
      ).length,
    };
  }, [blogs]);

  /* =========================================================
     IMAGE SELECT
     ========================================================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file.",
      );

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB.",
      );

      event.target.value = "";

      return;
    }

    setError(null);

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview((previous) => {
      if (
        previous?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previous);
      }

      return previewUrl;
    });
  };

  /* =========================================================
     RESET FORM
     ========================================================= */

  const resetForm = () => {
    if (
      imagePreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview(null);
    setEditingId(null);
    setError(null);
    setShowForm(false);
  };

  /* =========================================================
     CREATE
     ========================================================= */

  const handleCreate = () => {
    if (
      imagePreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview(null);
    setEditingId(null);
    setError(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     SLUG
     ========================================================= */

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((previous) => ({
      ...previous,
      slug,
    }));
  };

  /* =========================================================
     EDIT
     ========================================================= */

  const handleEdit = (
    blog: Blog,
  ) => {
    if (
      imagePreview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditingId(blog.id);

    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      content: blog.content,
      status: blog.status,
      publishedAt:
        blog.publishedAt
          ? new Date(
              blog.publishedAt,
            )
              .toISOString()
              .slice(0, 16)
          : "",
    });

    setSelectedImage(null);

    setImagePreview(
      getImageUrl(blog.coverImage),
    );

    setError(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     SAVE
     ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.content.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title.trim(),
      );

      formData.append(
        "slug",
        form.slug.trim(),
      );

      formData.append(
        "excerpt",
        form.excerpt.trim(),
      );

      formData.append(
        "content",
        form.content,
      );

      formData.append(
        "status",
        form.status,
      );

      if (form.publishedAt) {
        formData.append(
          "publishedAt",
          new Date(
            form.publishedAt,
          ).toISOString(),
        );
      }

      if (selectedImage) {
        formData.append(
          "coverImage",
          selectedImage,
        );
      }

      const response = editingId
        ? await callApi(
            `/blog-posts/${editingId}`,
            "PATCH",
            formData,
            true,
          )
        : await callApi(
            "/blog-posts",
            "POST",
            formData,
            true,
          );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to ${
              editingId
                ? "update"
                : "create"
            } blog post`,
        );
      }

      const savedRaw =
        result?.data ?? result;

      const savedBlog =
        normalizeBlog(
          savedRaw as Record<
            string,
            unknown
          >,
          0,
        );

      if (editingId) {
        setBlogs((previous) =>
          previous.map((blog) =>
            blog.id === editingId
              ? savedBlog
              : blog,
          ),
        );
      } else {
        setBlogs((previous) => [
          savedBlog,
          ...previous,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this blog post?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      const response =
        await callApi(
          `/blog-posts/${id}`,
          "DELETE",
          undefined,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete blog post",
        );
      }

      setBlogs((previous) =>
        previous.filter(
          (blog) => blog.id !== id,
        ),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete blog post",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (
    date?: string | null,
  ) => {
    if (!date) {
      return "Not published";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
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

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <BookOpen
              size={21}
              className="text-white"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Blog
            </h1>

            <p className="text-sm text-white/45">
              Manage your portfolio blog
              posts.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <Plus
              size={17}
              strokeWidth={1.8}
            />

            Create Blog
          </button>
        )}
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="text-red-200/60 transition hover:text-red-200"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =====================================================
          BLOG LIST
          ===================================================== */}

      {!showForm && (
        <>
          {/* STATS */}

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">
                    Total
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stats.total}
                  </p>
                </div>

                <FileText
                  size={20}
                  className="text-white/40"
                  strokeWidth={1.6}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">
                    Published
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stats.published}
                  </p>
                </div>

                <BookOpen
                  size={20}
                  className="text-white/40"
                  strokeWidth={1.6}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">
                    Drafts
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stats.drafts}
                  </p>
                </div>

                <Edit3
                  size={20}
                  className="text-white/40"
                  strokeWidth={1.6}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">
                    Archived
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stats.archived}
                  </p>
                </div>

                <FileText
                  size={20}
                  className="text-white/40"
                  strokeWidth={1.6}
                />
              </div>
            </Card>
          </div>

          {/* BLOG POSTS */}

          <Card className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Blog Posts
              </h2>

              <p className="mt-1 text-sm text-white/40">
                All posts including drafts
                and archived articles.
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Loader2
                  size={24}
                  className="animate-spin text-white/50"
                />
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <BookOpen
                  size={30}
                  className="mb-3 text-white/20"
                  strokeWidth={1.5}
                />

                <p className="text-sm text-white/50">
                  No blog posts yet.
                </p>

                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <Plus size={16} />
                  Create your first blog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {blogs.map(
                  (blog, index) => {
                    const imageUrl =
                      getImageUrl(
                        blog.coverImage,
                      );

                    const blogKey =
                      blog.id ||
                      `${blog.slug}-${blog.createdAt}-${index}`;

                    return (
                      <div
                        key={blogKey}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15 lg:flex-row lg:items-center"
                      >
                        {/* IMAGE */}

                        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 lg:w-36">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={
                                blog.title ||
                                "Blog cover"
                              }
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="144px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImagePlus
                                size={22}
                                className="text-white/20"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}

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
                              {
                                blog.excerpt
                              }
                            </p>
                          ) : blog.content ? (
                            <p className="mt-2 line-clamp-2 text-sm text-white/35">
                              {blog.content}
                            </p>
                          ) : null}

                          <p className="mt-2 text-xs text-white/30">
                            {blog.status ===
                            "PUBLISHED"
                              ? `Published ${formatDate(
                                  blog.publishedAt,
                                )}`
                              : `Created ${formatDate(
                                  blog.createdAt,
                                )}`}
                          </p>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 gap-2">
                          {blog.status ===
                            "PUBLISHED" && (
                            <a
                              href={`/blog/${blog.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
                              title="View blog"
                            >
                              <ArrowUpRight
                                size={16}
                                strokeWidth={1.6}
                              />

                              <span className="hidden sm:inline">
                                See More
                              </span>
                            </a>
                          )}

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                blog,
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                            title="Edit"
                          >
                            <Edit3
                              size={16}
                              strokeWidth={
                                1.6
                              }
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                blog.id,
                              )
                            }
                            disabled={
                              deletingId ===
                              blog.id
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 text-red-300/60 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId ===
                            blog.id ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={16}
                                strokeWidth={
                                  1.6
                                }
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </Card>
        </>
      )}

      {/* =====================================================
          CREATE / EDIT FORM
          ===================================================== */}

      {showForm && (
        <Card className="p-6">
          {/* FORM HEADER */}

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId
                  ? "Edit Blog Post"
                  : "Create Blog Post"}
              </h2>

              <p className="mt-1 text-sm text-white/40">
                {editingId
                  ? "Update your blog post."
                  : "Create a new article for your portfolio."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* TITLE + SLUG */}

            <div className="grid gap-5 lg:grid-cols-2">
              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        title:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder="Enter blog title"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Slug
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          slug: event
                            .target
                            .value,
                        }),
                      )
                    }
                    placeholder="blog-post-slug"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                  />

                  <button
                    type="button"
                    onClick={
                      generateSlug
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* EXCERPT */}

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Excerpt
              </label>

              <textarea
                value={form.excerpt}
                onChange={(event) =>
                  setForm(
                    (previous) => ({
                      ...previous,
                      excerpt:
                        event.target
                          .value,
                    }),
                  )
                }
                rows={3}
                placeholder="Short description of the article..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            {/* CONTENT */}

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Content
              </label>

              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm(
                    (previous) => ({
                      ...previous,
                      content:
                        event.target
                          .value,
                    }),
                  )
                }
                rows={12}
                placeholder="Write your blog content..."
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            {/* COVER IMAGE */}

            <div>
              <label className="mb-2 block text-sm text-white/60">
                Cover Image
              </label>

              <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                {/* UPLOAD */}

                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-center transition hover:border-white/25 hover:bg-white/10">
                  <ImagePlus
                    size={28}
                    className="mb-3 text-white/40"
                    strokeWidth={1.5}
                  />

                  <span className="text-sm text-white/70">
                    {selectedImage
                      ? selectedImage.name
                      : "Choose cover image"}
                  </span>

                  <span className="mt-1 text-xs text-white/30">
                    PNG, JPG, WEBP · Max
                    5MB
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                </label>

                {/* PREVIEW */}

                {imagePreview ? (
                  <div className="relative h-32 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src={imagePreview}
                      alt="Cover preview"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <span className="text-xs text-white/25">
                      No image selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS + DATE */}

            <div className="grid gap-5 lg:grid-cols-2">
              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        status:
                          event.target
                            .value as BlogStatus,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  <option
                    value="DRAFT"
                    className="bg-black"
                  >
                    Draft
                  </option>

                  <option
                    value="PUBLISHED"
                    className="bg-black"
                  >
                    Published
                  </option>

                  <option
                    value="ARCHIVED"
                    className="bg-black"
                  >
                    Archived
                  </option>
                </select>
              </div>

              {/* DATE */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Published At
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.publishedAt
                  }
                  onChange={(event) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        publishedAt:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
                />
              </div>
            </div>

            {/* SUBMIT */}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : editingId ? (
                  <Save size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Post"
                    : "Create Post"}
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

