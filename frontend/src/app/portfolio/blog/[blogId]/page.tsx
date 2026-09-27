import WriteBlogComment from "@/components/common/blog/blog-comments/WriteBlogComment";
import ViewBlog from "@/components/common/blog/ViewBlog";

type BlogPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

export default async function BlogPostPage({
  params,
}: BlogPageProps) {
  const { blogId } = await params;

  return (
    <div className="mt-5">
      <ViewBlog
        blogId={blogId}
        isAdmin={false}
      />

      <div className="sticky bottom-5 left-0 right-0 z-50 px-4 pb-4">
        <div className="mx-auto max-w-4xl">
          <WriteBlogComment
            blogId={blogId}
          />
        </div>
      </div>
    </div>
  );
}