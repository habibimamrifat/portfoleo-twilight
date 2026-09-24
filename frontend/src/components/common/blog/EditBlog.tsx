"use client";

import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import Card from "@/components/common/util/Card";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

export type BlogStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  publishedAt: string;
  coverImage?: string | null;
}

interface EditBlogProps {
  blogId: string;
  refreshParent: () => void;
  onCancel: () => void;
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  publishedAt: "",
  coverImage: null,
};

export default function EditBlog({
  blogId,
  refreshParent,
  onCancel,
}: EditBlogProps) {
  const [form, setForm] =
    useState<BlogFormData>(emptyForm);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

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

        const response = await getApi(
          `/blog-posts/admin/${blogId}`,
          true,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load blog post.",
          );
        }

        const blog =
          result?.data?.data ??
          result?.data ??
          result;

        if (cancelled) {
          return;
        }

        const publishedAt =
          blog.publishedAt
            ? new Date(
                blog.publishedAt,
              )
                .toISOString()
                .slice(0, 16)
            : "";

        setForm({
          title: blog.title ?? "",
          slug: blog.slug ?? "",
          excerpt: blog.excerpt ?? "",
          content: blog.content ?? "",
          status:
            blog.status === "PUBLISHED" ||
            blog.status === "ARCHIVED"
              ? blog.status
              : "DRAFT",
          publishedAt,
          coverImage:
            blog.coverImage ?? null,
        });

        setImagePreview(
          blog.coverImage ?? null,
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load blog post.",
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
  }, [blogId]);

  /* =========================================================
     IMAGE CLEANUP
     ========================================================= */

  useEffect(() => {
    return () => {
      if (
        imagePreview?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
     SLUG
     ========================================================= */

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        "",
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((previous) => ({
      ...previous,
      slug,
    }));
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
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

      const response =
        await callApi(
          `/blog-posts/${blogId}`,
          "PATCH",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update blog post.",
        );
      }

      /*
       * Tell the parent to reload its
       * blog list with the latest data.
       */
      refreshParent();

      /*
       * Close the edit form after
       * successful update.
       */
      onCancel();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update blog post.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex min-h-60 items-center justify-center">
          <Loader2
            size={26}
            className="animate-spin text-white/40"
          />
        </div>
      </Card>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <Card className="p-6">
      {/* FORM HEADER */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Edit Blog Post
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Update your blog post.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} />
          Cancel
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

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
              Title xx
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  title:
                    event.target.value,
                }))
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
                  setForm((previous) => ({
                    ...previous,
                    slug:
                      event.target.value,
                  }))
                }
                placeholder="blog-post-slug"
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <button
                type="button"
                onClick={generateSlug}
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
              setForm((previous) => ({
                ...previous,
                excerpt:
                  event.target.value,
              }))
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
              setForm((previous) => ({
                ...previous,
                content:
                  event.target.value,
              }))
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
                PNG, JPG, WEBP · Max 5MB
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
                setForm((previous) => ({
                  ...previous,
                  status:
                    event.target.value as BlogStatus,
                }))
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
              value={form.publishedAt}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  publishedAt:
                    event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
            />
          </div>
        </div>

        {/* SUBMIT */}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
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
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : "Update Post"}
          </button>
        </div>
      </form>
    </Card>
  );
}