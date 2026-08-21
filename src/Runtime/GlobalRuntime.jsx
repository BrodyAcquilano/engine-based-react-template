import { useState } from "react";

export function useGlobalRuntime() {
  const [project, setProject] = useState(null);

  const engineKey = project?.engineKey ?? null;

  return {
    project,
    setProject,

    engineKey,
  };
}