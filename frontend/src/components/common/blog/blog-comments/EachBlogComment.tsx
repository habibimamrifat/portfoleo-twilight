"use client";

import {
  Clock3,
  Loader2,
  MessageCircle,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import BlogCommentActions from "./BlogCommentActions";


export type CommentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface BlogCommentData {
  id: string;
  blogPostId: string;
  name: string;
  email?: string | null;
  comment: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt?: string;
}

interface BlogCommentProps {
  comment: BlogCommentData;
  isAdmin?: boolean;
  onStatusChange: (
    commentId: string,
    status: "APPROVED" | "REJECTED",
  ) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  actionLoading?: string | null;
}

export default function BlogComment({
  comment,
  isAdmin = false,
  onStatusChange,
  onDelete,
  actionLoading = null,
}: BlogCommentProps) {
  const isActionLoading =
    actionLoading === comment.id;

  const formattedDate = new Date(
    comment.createdAt,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-white">
            {comment.name}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/30">
            <time dateTime={comment.createdAt}>
              {formattedDate}
            </time>

            {isAdmin && (
              <>
                <span>•</span>

                <span
                  className={
                    comment.status === "APPROVED"
                      ? "text-green-300"
                      : comment.status === "REJECTED"
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
          <BlogCommentActions
            comment={comment}
            loading={isActionLoading}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
        {comment.comment}
      </p>

      {isAdmin &&
        comment.status === "PENDING" && (
          <div className="mt-4 flex items-center gap-2 text-xs text-yellow-300/70">
            {isActionLoading ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Clock3 size={13} />
            )}

            Waiting for approval
          </div>
        )}
    </Card>
  );
}