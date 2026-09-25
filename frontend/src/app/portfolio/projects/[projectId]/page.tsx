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
    <ViewProject
      projectId={projectId}
      isAdmin={false}
    />
  );
}