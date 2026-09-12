"use client";

import Link from "next/link";
import Card from "../common/Card";
import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    title: "What I Learned Building Scalable Backends",
    excerpt:
      "Lessons from working with APIs, databases, modular architecture and backend systems.",
    date: "September 2026",
  },
  {
    title: "From Full-Stack Development to System Design",
    excerpt:
      "My journey toward understanding how large-scale applications are designed and structured.",
    date: "August 2026",
  },
  {
    title: "Why Clean Architecture Matters",
    excerpt:
      "How good structure can make a project easier to understand, maintain and scale.",
    date: "July 2026",
  },
];

export default function Blog() {
  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Blog
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Things I'm learning.
          </h2>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card
              key={post.title}
              className="p-7 transition duration-300 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs text-white/40">
                    {post.date}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href="/blog"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}