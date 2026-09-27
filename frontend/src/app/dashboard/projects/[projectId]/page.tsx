import ViewProject from "@/components/common/projects/ViewProject";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params;

  return (
    <div>
      <ViewProject
        projectId={projectId}
        isAdmin={true}
      />
    </div>
  );
}