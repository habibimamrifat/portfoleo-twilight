"use client";


import WorkSectorDelete from "./WorksectorDelete";
import WorkSectorUpdate from "./WorkSectorUpdate";

interface WorkSectorActionProps {
  sectorId: string;
  onChanged: () => void;
}

export default function WorkSectorAction({
  sectorId,
  onChanged,
}: WorkSectorActionProps) {
  return (
    <div className="flex items-center gap-2">
      <WorkSectorUpdate
        sectorId={sectorId}
        onChanged={onChanged}
      />

      <WorkSectorDelete
        sectorId={sectorId}
        onChanged={onChanged}
      />
    </div>
  );
}