"use client";

import {
  Check,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { BlogCommentData } from "./EachBlogComment";



interface BlogCommentActionsProps {
  comment: BlogCommentData;
  loading: boolean;
  onStatusChange: (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export default function BlogCommentActions({
  comment,
  loading,
  onStatusChange,
  onDelete,
}: BlogCommentActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {comment.status !== "APPROVED" && (
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            onStatusChange(
              comment.id,
              "APPROVED",
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-400/20 bg-green-500/10 text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          title="Approve"
        >
          {loading ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Check size={15} />
          )}
        </button>
      )}

      {comment.status !== "REJECTED" && (
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            onStatusChange(
              comment.id,
              "REJECTED",
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          title="Reject"
        >
          {loading ? (
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
        disabled={loading}
        onClick={() => onDelete(comment.id)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        title="Delete"
      >
        {loading ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}