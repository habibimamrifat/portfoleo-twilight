import ViewExperience from "@/components/common/experience/ViewExperience";

type ExperiencePageProps = {
  params: Promise<{
    experienceId: string;
  }>;
};

export default async function ExperiencePage({
  params,
}: ExperiencePageProps) {
  const { experienceId } = await params;

  return (
    <ViewExperience
      experienceId={experienceId}
      isAdmin
    />
  );
}