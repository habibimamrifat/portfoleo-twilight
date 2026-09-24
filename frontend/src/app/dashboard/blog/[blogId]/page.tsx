import ViewBlog from "@/components/common/blog/ViewBlog";

interface BlogPageProps {
  params: Promise<{
    blogId: string;
  }>;
}

export default async function BlogPage({
  params,
}: BlogPageProps) {
  const { blogId } = await params;

  return (
    <div>
    <ViewBlog
      blogId={blogId}
      isAdmin={true}
    />
    </div>

  );
}