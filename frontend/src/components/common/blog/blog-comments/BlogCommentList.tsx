"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MessageCircle,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

import BlogComment, {
  BlogCommentData,
} from "./EachBlogComment";

interface BlogCommentListProps {
  blogId: string;
  isAdmin?: boolean;
}

export default function BlogCommentList({
  blogId,
  isAdmin = false,
}: BlogCommentListProps) {
  const [comments, setComments] = useState<
    BlogCommentData[]
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
        setLoading(true);
        setError(null);

        const endpoint = isAdmin
          ? `/blog-comments/admin/post/${blogId}`
          : `/blog-comments/post/${blogId}`;

        /*
         * Public:
         *   authorization = false
         *
         * Admin:
         *   authorization = true
         */
        const response = await getApi(
          endpoint,
          isAdmin,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load comments.",
          );
        }

        const data =
          result?.data?.data ??
          result?.data ??
          result;

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid comments response.",
          );
        }

        if (cancelled) {
          return;
        }

        setComments(data);
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
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [blogId, isAdmin]);

  const updateCommentStatus = async (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      setActionLoading(commentId);
      setError(null);

      /*
       * Admin endpoint.
       *
       * 4th argument = authorization
       */
      const response = await callApi(
        `/blog-comments/${commentId}`,
        "PATCH",
        {
          status,
        },
        true,
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(commentId);
      setError(null);

      /*
       * Admin endpoint.
       *
       * 3rd argument:
       *     undefined
       *
       * 4th argument:
       *     true = authorization required
       */
      const response = await callApi(
        `/blog-comments/${commentId}`,
        "DELETE",
        undefined,
        true,
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
          Comments
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
          {comments.map((comment) => (
            <BlogComment
              key={comment.id}
              comment={comment}
              isAdmin={isAdmin}
              actionLoading={actionLoading}
              onStatusChange={updateCommentStatus}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}
    </section>
  );
}