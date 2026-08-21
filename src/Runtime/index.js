import { useGlobalRuntime } from "./GlobalRuntime.jsx";
import { useDefaultRuntime } from "./DefaultRuntime.jsx";

export function useAllRuntime() {
  const global = useGlobalRuntime();

  const defaultRuntime = useDefaultRuntime({
    project: global.project,
  });

  return {
    global,
    default: defaultRuntime,
  };
}