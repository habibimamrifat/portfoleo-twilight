"use client";

import { useState } from "react";

import WorkSectorCreate from "./WorkSectorCreate";
import WorkSectorList from "./WorkSectorList";

interface WorkSectorProps {
  isAdmin?: boolean;
}

export default function WorkSector({
  isAdmin = false,
}: WorkSectorProps) {
  const [refresh, setRefresh] =
    useState(0);

  const handleChanged = () => {
    setRefresh((value) => value + 1);
  };

  return (
    <div>

      {isAdmin && (
        <WorkSectorCreate
          onCreated={handleChanged}
        />
      )}

      <div className={isAdmin ? "mt-6" : ""}>
        <WorkSectorList
          isAdmin={isAdmin}
          refresh={refresh}
        />
      </div>
    </div>
  );
}