export function useDefaultRuntime({ project }) {
  const isActive = project?.engineKey === "default";

  return {
    isActive,
  };
}