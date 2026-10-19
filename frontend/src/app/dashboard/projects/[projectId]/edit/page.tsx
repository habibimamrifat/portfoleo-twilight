"use client";

import EditProject from "@/components/common/projects/EditProject";
import { useRouter, useParams } from "next/navigation";



export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();

  const projectId = params.projectId;

  const handleRefresh = () => {
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/dashboard/projects");
  };

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <EditProject
        projectId={projectId}
        refreshParent={handleRefresh}
        onCancel={handleCancel}
      />
    </main>
  );
}