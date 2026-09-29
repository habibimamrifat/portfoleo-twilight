"use client";

import Link from "next/link";
import BlogList from "../common/blog/BlogList";

export default function Blog() {
  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Blog
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Things Im learning.
            </h2>
          </div>

          {/* SEE ALL */}

          <Link
            href="/portfolio/blog"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            See All
          </Link>
        </div>

        {/* BLOG LIST */}

        <BlogList
          isAdmin={false}
          isPortfolio
        />
      </div>
    </section>
  );
}