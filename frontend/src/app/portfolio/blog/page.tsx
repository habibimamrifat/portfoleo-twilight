"use client";

import BlogList from "@/components/common/blog/BlogList";

export default function BlogPage() {
  return (
    <section
      id="blog"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Blog
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Thoughts and insights.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Articles, ideas and lessons from my work and
            development journey.
          </p>
        </div>

        {/* All Blogs */}
        <BlogList />
      </div>
    </section>
  );
}