"use client";

import { useState } from "react";
import { Mail, Send, X, Loader2 } from "lucide-react";

import Card from "../common/Card";
import { callApi } from "@/api/callApi";

type ContactForm = {
  name: string;
  email: string;
  designation: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  designation: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] =
    useState<ContactForm>(initialForm);

  const [sending, setSending] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /* =========================================================
     OPEN POPUP
     ========================================================= */

  const openContact = () => {
    setError(null);
    setSuccess(null);
    setIsOpen(true);
  };

  /* =========================================================
     CLOSE POPUP
     ========================================================= */

  const closeContact = () => {
    if (sending) {
      return;
    }

    setIsOpen(false);
    setError(null);
    setSuccess(null);
  };

  /* =========================================================
     HANDLE INPUT
     ========================================================= */

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

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    try {
      setSending(true);
      setError(null);
      setSuccess(null);

      const response = await callApi(
        "/contact",
        "POST",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          designation:
            form.designation.trim() || undefined,
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to send your message.",
        );
      }

      setSuccess(
        result?.message ||
          "Your message has been sent successfully.",
      );

      setForm(initialForm);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send your message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* =====================================================
          CONTACT SECTION
          ===================================================== */}

      <section
        id="contact"
        className="px-6 py-20 lg:px-10"
      >
        <div className="space-y-6">
          {/* HEADER */}

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Contact
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Lets build something.
            </h2>
          </div>

          {/* CONTACT CARD */}

          <Card className="p-8 lg:p-10">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold">
                Have a project in mind?
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/50">
                Tell me what you are building, what
                problem you are trying to solve, and
                where you need help. I will get back to
                you with the next steps.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {/* EMAIL BUTTON */}

                <button
                  type="button"
                  onClick={openContact}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white/20"
                >
                  <Mail size={16} />

                  Email Me
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* =====================================================
          FULL SCREEN CONTACT POPUP
          ===================================================== */}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-xl sm:px-6">
          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={closeContact}
            disabled={sending}
            aria-label="Close contact form"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:right-8 sm:top-8"
          >
            <X size={20} />
          </button>

          {/* FORM CONTAINER */}

          <div className="w-full max-w-2xl">
            <Card className="relative p-6 sm:p-8 lg:p-10">
              {/* FORM HEADER */}

              <div className="mb-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Mail
                    size={19}
                    className="text-white/70"
                  />
                </div>

                <h2 className="text-2xl font-semibold text-white">
                  Send me a message
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Tell me a little about yourself and
                  what you would like to build.
                </p>
              </div>

              {/* SUCCESS */}

              {success && (
                <div className="mb-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* NAME + EMAIL */}

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm text-white/60"
                    >
                      Name
                    </label>

                    <input
                      id="contact-name"
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

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm text-white/60"
                    >
                      Email
                    </label>

                    <input
                      id="contact-email"
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

                {/* DESIGNATION */}

                <div>
                  <label
                    htmlFor="contact-designation"
                    className="mb-2 block text-sm text-white/60"
                  >
                    Designation
                    <span className="ml-2 text-xs text-white/25">
                      Optional
                    </span>
                  </label>

                  <input
                    id="contact-designation"
                    name="designation"
                    type="text"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="e.g. Founder, Software Engineer"
                    maxLength={150}
                    disabled={sending}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* SUBJECT */}

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm text-white/60"
                  >
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What would you like to discuss?"
                    maxLength={200}
                    disabled={sending}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* MESSAGE */}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm text-white/60"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={7}
                    maxLength={5000}
                    disabled={sending}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* ACTIONS */}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeContact}
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

                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />

                        Send Message
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