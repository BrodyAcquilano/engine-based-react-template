import { DefaultEngine } from "./Default/engine.js";

const ENGINE_REGISTRY = {
  default: DefaultEngine,
};

export function getEngine(engineKey) {
  return ENGINE_REGISTRY[engineKey] ?? null;
}

export function getEngineList() {
  return Object.values(ENGINE_REGISTRY).map((engine) => ({
    key: engine.key,
    label: engine.label,
  }));
}