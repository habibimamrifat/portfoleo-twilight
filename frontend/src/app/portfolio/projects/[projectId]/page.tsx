import WriteProjectComment from "@/components/common/projects/comments/WriteProjectComment";
import ViewProject from "@/components/common/projects/ViewProject";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailsPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params;

  return (
    <div className="mt-5">
      <ViewProject
        projectId={projectId}
        isAdmin={false}
      />

      <div className="sticky bottom-5 left-0 right-0 z-50 px-4 pb-4">
        <div className="mx-auto max-w-4xl">
          <WriteProjectComment
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  );
}