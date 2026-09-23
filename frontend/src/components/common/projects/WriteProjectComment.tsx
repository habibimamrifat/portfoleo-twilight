"use client";

import { useState } from "react";
import {
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { callApi } from "@/api/callApi";

type WriteProjectCommentProps = {
  projectId: string;
  onCommentSubmitted?: () => void;
};

type CommentForm = {
  name: string;
  email: string;
  comment: string;
};

const initialForm: CommentForm = {
  name: "",
  email: "",
  comment: "",
};

export default function WriteProjectComment({
  projectId,
  onCommentSubmitted,
}: WriteProjectCommentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] =
    useState<CommentForm>(initialForm);

  const [sending, setSending] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const openModal = () => {
    setError(null);
    setSuccess(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (sending) {
      return;
    }

    setIsOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }

    if (success) {
      setSuccess(null);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!projectId) {
      setError(
        "Project could not be identified.",
      );
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    try {
      setSending(true);
      setError(null);
      setSuccess(null);

      const response = await callApi(
        "/project-comments",
        "POST",
        {
          projectId,
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          comment: form.comment.trim(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to submit your comment.",
        );
      }

      setSuccess(
        result?.message ||
          "Your comment has been submitted and is awaiting approval.",
      );

      setForm(initialForm);

      onCommentSubmitted?.();
    } catch (error) {
      console.error(
        "Failed to submit project comment:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit your comment. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Write Comment Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <MessageCircle size={17} />
          Write a Comment
        </button>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-xl sm:px-6">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeModal}
            disabled={sending}
            aria-label="Close comment form"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:right-8 sm:top-8"
          >
            <X size={20} />
          </button>

          <div className="w-full max-w-xl">
            <Card className="relative p-6 sm:p-8">
              {/* Header */}
              <div className="mb-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <MessageCircle
                    size={19}
                    className="text-white/70"
                  />
                </div>

                <h2 className="text-2xl font-semibold text-white">
                  Write a Comment
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Share your thoughts about this project.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="mb-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm leading-6 text-green-300">
                  {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="project-comment-name"
                      className="mb-2 block text-sm text-white/60"
                    >
                      Name
                    </label>

                    <input
                      id="project-comment-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      maxLength={100}
                      disabled={sending}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="project-comment-email"
                      className="mb-2 block text-sm text-white/60"
                    >
                      Email
                      <span className="ml-2 text-xs text-white/25">
                        Optional
                      </span>
                    </label>

                    <input
                      id="project-comment-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      maxLength={255}
                      disabled={sending}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="project-comment-message"
                    className="mb-2 block text-sm text-white/60"
                  >
                    Comment
                  </label>

                  <textarea
                    id="project-comment-message"
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Write your comment..."
                    rows={6}
                    maxLength={2000}
                    disabled={sending}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={sending}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Comment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}