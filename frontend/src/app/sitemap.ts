import type { MetadataRoute } from "next";

const baseUrl = "https://habibrifat.com";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.habibrifat.com";

type BlogPost = {
  id?: string;
  _id?: string;
  blogId?: string;
  blog_id?: string;
  status?: string;
  updatedAt?: string;
  updated_at?: string;
  publishedAt?: string;
  published_at?: string;
};

function extractBlogs(result: unknown): BlogPost[] {
  if (Array.isArray(result)) {
    return result as BlogPost[];
  }

  if (!result || typeof result !== "object") {
    return [];
  }

  const response = result as Record<string, unknown>;

  const containers = [
    response.data,
    response.blogs,
    response.posts,
    response.items,
    response.results,
  ];

  for (const container of containers) {
    if (Array.isArray(container)) {
      return container as BlogPost[];
    }

    if (container && typeof container === "object") {
      const nested = container as Record<string, unknown>;

      const nestedArrays = [
        nested.data,
        nested.blogs,
        nested.posts,
        nested.items,
        nested.results,
      ];

      for (const nestedArray of nestedArrays) {
        if (Array.isArray(nestedArray)) {
          return nestedArray as BlogPost[];
        }
      }
    }
  }

  return [];
}

async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${apiUrl}/blog-posts`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Sitemap blog request failed: ${response.status}`,
      );
      return [];
    }

    const result: unknown = await response.json();
    const blogs = extractBlogs(result);

    return blogs.filter(
      (blog) =>
        String(blog.status ?? "").toUpperCase() === "PUBLISHED",
    );
  } catch (error) {
    console.error(
      "Failed to fetch blogs for sitemap:",
      error,
    );
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio/projects`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio/experience`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogs = await getPublishedBlogs();

  const blogPages: MetadataRoute.Sitemap = blogs.flatMap(
    (blog) => {
      const id =
        blog.id ??
        blog._id ??
        blog.blogId ??
        blog.blog_id;

      if (id === undefined || id === null || String(id).trim() === "") {
        return [];
      }

      const lastModified =
        blog.updatedAt ??
        blog.updated_at ??
        blog.publishedAt ??
        blog.published_at;

      const validDate =
        lastModified && !Number.isNaN(Date.parse(lastModified))
          ? new Date(lastModified)
          : undefined;

      return [
        {
          url: `${baseUrl}/portfolio/blog/${encodeURIComponent(String(id))}`,
          ...(validDate ? { lastModified: validDate } : {}),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        },
      ];
    },
  );

  return [...staticPages, ...blogPages];
}
