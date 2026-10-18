
import type { Metadata } from "next";

import WriteBlogComment from "@/components/common/blog/blog-comments/WriteBlogComment";
import ViewBlog from "@/components/common/blog/ViewBlog";

type BlogPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

const SITE_URL = "https://habibrifat.com";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.habibrifat.com";

async function getPublishedBlog(
  blogId: string,
): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${API_URL}/blog-posts/blog/${encodeURIComponent(blogId)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const blog = payload?.data?.data ?? payload?.data ?? payload;

    if (!blog || blog.status !== "PUBLISHED") {
      return null;
    }

    return blog as BlogPost;
  } catch {
    return null;
  }
}

function getDescription(blog: BlogPost): string {
  const text = (blog.excerpt || blog.content)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return "Read this article by Habib Rifat about software development and technology.";
  }

  return text.length > 160
    ? `${text.slice(0, 157)}...`
    : text;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await getPublishedBlog(blogId);

  if (!blog) {
    return {
      title: "Blog Article",
      description:
        "Read development articles and technical insights by Habib Rifat.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = blog.title;
  const description = getDescription(blog);
  const canonicalUrl =
    `${SITE_URL}/portfolio/blog/${encodeURIComponent(blog.id)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: "Habib Rifat Portfolio",
      publishedTime: blog.publishedAt ?? undefined,
      images: blog.coverImage
        ? [{ url: blog.coverImage }]
        : undefined,
    },
    twitter: {
      card: blog.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPageProps) {
  const { blogId } = await params;

  return (
    <div className="mt-5">
      <ViewBlog blogId={blogId} isAdmin={false} />

      <div className="sticky bottom-5 left-0 right-0 z-50 px-4 pb-4">
        <div className="mx-auto max-w-4xl">
          <WriteBlogComment blogId={blogId} />
        </div>
      </div>
    </div>
  );
}

