import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import Header from "./Workspace/Navigation/Header.jsx";
import WorkspacePage1 from "./Workspace/WorkspacePage1/WorkspacePage1.jsx";
import WorkspacePage2 from "./Workspace/WorkspacePage2/WorkspacePage2.jsx";

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
            element={<WorkspacePage1 />}
          />

          {engine?.PagesAdapter?.({
            runtime,
          })}

          <Route
            path="/workspace2"
            element={<WorkspacePage2 />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
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