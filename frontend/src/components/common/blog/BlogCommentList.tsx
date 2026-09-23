"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Loader2,
  MessageCircle,
  Trash2,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type CommentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type BlogComment = {
  id: string;
  postId: string;
  name: string;
  email?: string | null;
  comment: string;
  status: CommentStatus;
  createdAt: string;
};

type BlogCommentListProps = {
  blogId: string;
  isAdmin?: boolean;
  refreshTrigger?: number;
};

export default function BlogCommentList({
  blogId,
  isAdmin = false,
  refreshTrigger = 0,
}: BlogCommentListProps) {
  const [comments, setComments] = useState<
    BlogComment[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [actionLoading, setActionLoading] = useState<
    string | null
  >(null);

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

        const result = await response.json();

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
  }, [blogId, isAdmin, refreshTrigger]);

  const updateCommentStatus = async (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      setActionLoading(commentId);

      const response = await callApi(
        `/blog-comments/${commentId}`,
        "PATCH",
        {
          status,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update comment.",
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
      setActionLoading(null);
    }
  };

  const deleteComment = async (
    commentId: string,
  ) => {
    try {
      setActionLoading(commentId);

      const response = await callApi(
        `/blog-comments/${commentId}`,
        "DELETE",
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete comment.",
        );
      }

      setComments((previous) =>
        previous.filter(
          (comment) => comment.id !== commentId,
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
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3 py-6 text-sm text-white/40">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading comments...
        </div>
      </Card>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <MessageCircle
          size={19}
          className="text-white/60"
        />

        <h2 className="text-xl font-semibold text-white">
          {isAdmin ? "Comments" : "Comments"}
        </h2>

        {comments.length > 0 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/40">
            {comments.length}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
          {error}
        </div>
      )}

      {comments.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <MessageCircle
                size={20}
                className="text-white/30"
              />
            </div>

            <h3 className="mt-4 text-base font-medium text-white/70">
              No comments yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
              {isAdmin
                ? "There are no comments on this blog post yet."
                : "Be the first to share your thoughts about this article."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isActionLoading =
              actionLoading === comment.id;

            return (
              <Card
                key={comment.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium text-white">
                      {comment.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/30">
                      <time
                        dateTime={comment.createdAt}
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

                      {isAdmin && (
                        <>
                          <span>•</span>

                          <span
                            className={
                              comment.status ===
                              "APPROVED"
                                ? "text-green-300"
                                : comment.status ===
                                    "REJECTED"
                                  ? "text-red-300"
                                  : "text-yellow-300"
                            }
                          >
                            {comment.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex shrink-0 items-center gap-2">
                      {comment.status !==
                        "APPROVED" && (
                        <button
                          type="button"
                          disabled={
                            isActionLoading
                          }
                          onClick={() =>
                            updateCommentStatus(
                              comment.id,
                              "APPROVED",
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-400/20 bg-green-500/10 text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Approve"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Check size={15} />
                          )}
                        </button>
                      )}

                      {comment.status !==
                        "REJECTED" && (
                        <button
                          type="button"
                          disabled={
                            isActionLoading
                          }
                          onClick={() =>
                            updateCommentStatus(
                              comment.id,
                              "REJECTED",
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Reject"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <X size={15} />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={
                          isActionLoading
                        }
                        onClick={() =>
                          deleteComment(
                            comment.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete"
                      >
                        {isActionLoading ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                  {comment.comment}
                </p>

                {isAdmin &&
                  comment.status ===
                    "PENDING" && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-yellow-300/70">
                      <Clock3 size={13} />
                      Waiting for approval
                    </div>
                  )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}