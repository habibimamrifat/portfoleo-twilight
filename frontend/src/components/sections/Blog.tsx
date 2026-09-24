"use client";

import BlogList from "../common/blog/BlogList";

export default function Blog() {
  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* HEADER */}

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Blog
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Things Im learning.
          </h2>
        </div>

        {/* BLOG LIST */}

        <BlogList isAdmin={false} />
      </div>
    </section>
  );
}