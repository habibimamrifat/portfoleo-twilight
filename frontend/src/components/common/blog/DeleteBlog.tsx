"use client";

import { callApi } from "@/api/callApi";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface BlogDeleteButtonProps {
  blogId: string;
  refreshParent: () => void;
}

export default function BlogDeleteButton({
  blogId,
  refreshParent,
}: BlogDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await callApi(`/blog-posts/${blogId}`, "DELETE");

      refreshParent();
    } catch (error) {
      console.error("Failed to delete blog:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete the blog post.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 text-red-300/60 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      title="Delete"
    >
      {deleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} strokeWidth={1.6} />
      )}
    </button>
  );
}