import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read Habib Rifat's articles, development insights, technical lessons, and experiences in full-stack and backend engineering.",
  alternates: {
    canonical: "/portfolio/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
