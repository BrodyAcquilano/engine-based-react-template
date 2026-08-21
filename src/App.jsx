import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import Header from "./Workspace/Navigation/Header.jsx";

import { useAllRuntime } from "./Runtime/index.js";
import { getEngine } from "./Engines/index.js";

import defaultProject from "../Data/Projects/defaultProject.json";

import "./App.css";

function App() {
  const allRuntime = useAllRuntime();

  const global = allRuntime.global;

  const engineRuntime = global.engineKey
    ? allRuntime[global.engineKey]
    : {};

  const runtime = {
    ...global,
    ...engineRuntime,
  };

  const engine = runtime.engineKey
    ? getEngine(runtime.engineKey)
    : null;

  // ─────────────────────────────────────────────
  // 1. Load Default Local Project
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (runtime.project) return;

    runtime.setProject(
      structuredClone(defaultProject),
    );
  }, [runtime.project, runtime.setProject]);

  const pagesConfig =
    engine?.getPagesConfig?.() || [];

  const defaultPage =
    pagesConfig[0]?.path || "page1";

  return (
    <div className="app">
      <Header
        pagesConfig={pagesConfig}
      />

      <main className="main-layer">
        {engine?.AppAdapter && (
          <engine.AppAdapter
            runtime={runtime}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={`/${defaultPage}`}
                replace
              />
            }
          />

          {engine?.PagesAdapter?.({
            runtime,
          })}

          <Route
            path="*"
            element={
              <Navigate
                to={`/${defaultPage}`}
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;