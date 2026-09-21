"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  MessageCircle,
  Trash2,
  User,
  X,
} from "lucide-react";

import Card from "@/components/common/Card";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type BlogComment = {
  id: string;
  postId: string;
  name: string;
  email?: string | null;
  comment: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type BlogCommentListProps = {
  blogId: string;
  isAdmin?: boolean;
};

export default function BlogCommentList({
  blogId,
  isAdmin = false,
}: BlogCommentListProps) {
  const [comments, setComments] = useState<
    BlogComment[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!blogId) {
      return;
    }

    let cancelled = false;

    const loadComments = async () => {
      try {
        const endpoint = isAdmin
          ? "/blog-comments"
          : `/blog-comments/post/${blogId}`;

        const response = await getApi(endpoint);

        if (!response.ok) {
          throw new Error(
            "Failed to load comments.",
          );
        }

        const result =
          await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        const filteredData = isAdmin
          ? data.filter(
              (comment: BlogComment) =>
                comment.postId === blogId,
            )
          : data;

        if (cancelled) {
          return;
        }

        setComments(filteredData);
        setError(null);
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch blog comments:",
          error,
        );

        setComments([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load comments.",
        );

        setLoading(false);
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [blogId, isAdmin]);

  /*
   * =========================
   * UPDATE STATUS
   * =========================
   */

  const updateStatus = async (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    if (!isAdmin || processingId) {
      return;
    }

    try {
      setProcessingId(commentId);
      setError(null);

      const response = await callApi(
        `/blog-comments/${commentId}`,
        "PATCH",
        {
          status,
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to ${status.toLowerCase()} comment.`,
        );
      }

      setComments((previous) =>
        previous.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                status,
              }
            : comment,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update comment:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update comment.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * =========================
   * DELETE COMMENT
   * =========================
   */

  const handleDelete = async (
    commentId: string,
  ) => {
    if (!isAdmin || processingId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(commentId);
      setError(null);

      const response = await callApi(
        `/blog-comments/${commentId}`,
        "DELETE",
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete comment.",
        );
      }

      setComments((previous) =>
        previous.filter(
          (comment) =>
            comment.id !== commentId,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to delete comment:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete comment.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * =========================
   * LOADING
   * =========================
   */

  if (loading) {
    return (
      <section className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <MessageCircle
              size={18}
              className="text-white/60"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Comments
            </h2>

            <p className="text-sm text-white/30">
              Loading comments...
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <Loader2
            size={20}
            className="animate-spin text-white/40"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      {/* Header */}

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <MessageCircle
            size={18}
            className="text-white/60"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Comments
          </h2>

          <p className="text-sm text-white/30">
            {comments.length}{" "}
            {comments.length === 1
              ? "comment"
              : "comments"}
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty */}

      {comments.length === 0 && !error && (
        <Card className="p-8 text-center">
          <MessageCircle
            size={25}
            className="mx-auto text-white/20"
          />

          <p className="mt-3 text-sm text-white/40">
            {isAdmin
              ? "No comments found for this blog post."
              : "No comments yet."}
          </p>

          {!isAdmin && (
            <p className="mt-1 text-xs text-white/25">
              Be the first to leave a comment.
            </p>
          )}
        </Card>
      )}

      {/* Comments */}

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card
              key={comment.id}
              className="p-5"
            >
              <div className="flex gap-4">
                {/* Avatar */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <User
                    size={17}
                    className="text-white/40"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {/* Header */}

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {comment.name}
                      </h3>

                      {isAdmin &&
                        comment.email && (
                          <p className="mt-1 text-xs text-white/30">
                            {comment.email}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Date */}

                      <div className="flex items-center gap-1.5 text-xs text-white/30">
                        <CalendarDays
                          size={13}
                        />

                        <time
                          dateTime={
                            comment.createdAt
                          }
                        >
                          {new Date(
                            comment.createdAt,
                          ).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </div>

                      {/* Admin Actions */}

                      {isAdmin && (
                        <div className="flex items-center gap-1.5">
                          {/* Approve */}

                          {comment.status !==
                            "APPROVED" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  comment.id,
                                  "APPROVED",
                                )
                              }
                              disabled={
                                processingId !==
                                null
                              }
                              title="Approve comment"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-400/10 bg-green-500/5 text-green-400/60 transition hover:bg-green-500/10 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {processingId ===
                              comment.id ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check
                                  size={15}
                                />
                              )}
                            </button>
                          )}

                          {/* Reject */}

                          {comment.status !==
                            "REJECTED" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  comment.id,
                                  "REJECTED",
                                )
                              }
                              disabled={
                                processingId !==
                                null
                              }
                              title="Reject comment"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-yellow-400/10 bg-yellow-500/5 text-yellow-400/60 transition hover:bg-yellow-500/10 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {processingId ===
                              comment.id ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <X
                                  size={15}
                                />
                              )}
                            </button>
                          )}

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                comment.id,
                              )
                            }
                            disabled={
                              processingId !==
                              null
                            }
                            title="Delete comment"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 bg-red-500/5 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {processingId ===
                            comment.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={15}
                              />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}

                  {isAdmin && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                          comment.status ===
                          "APPROVED"
                            ? "border-green-400/20 bg-green-500/10 text-green-300"
                            : comment.status ===
                                "REJECTED"
                              ? "border-red-400/20 bg-red-500/10 text-red-300"
                              : "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                        }`}
                      >
                        {comment.status}
                      </span>
                    </div>
                  )}

                  {/* Comment */}

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}