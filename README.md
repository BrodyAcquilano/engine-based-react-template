# Engine-Based React Template

A lightweight React + Vite application template for building applications with **runtime-driven state**, **engine-specific behavior**, **dynamic workflows**, and **adapter-based application structure**.

The template is intended as a reusable starting point for applications where different project types may use different workflows, components, state, tools, or UI behavior while still sharing the same overall React application shell.

It intentionally includes only the frontend architecture required to demonstrate this pattern. Backend services, authentication, APIs, databases, and hosting are left to the application built from the template.

---

## Purpose

A conventional React application can become difficult to maintain when project types begin requiring different:

* pages;
* components;
* state;
* workflows;
* tools;
* validation;
* UI behavior;
* data handling.

This template separates those concerns into several architectural layers:

```text
App
│
├── Workspace
│
├── Runtime
│
├── Engines
│
├── Workflows
│
└── Components
```

Instead of filling `App.jsx` with project-specific conditional rendering, the active project selects an **engine**.

The engine then determines which workflows and app-level components should be used.

---

# Core Architecture

## Project

A project represents a specific set of application data and configuration.

For example, two projects may contain completely different data while still using the same engine.

```text
Project A
engineKey: default

Project B
engineKey: default
```

Both projects use the same application behavior because they share the same engine, but their project data may be completely different.

A different project could instead specify another engine:

```text
Project C
engineKey: alternate
```

The project's `engineKey` determines which engine configuration and engine-specific runtime are selected.

---

## Engine

An engine defines how a particular type of project behaves.

Each engine has its own folder:

```text
src/
└── Engines/
    └── Default/
        ├── engine.js
        ├── PagesAdapter.jsx
        └── AppAdapter.jsx
```

The engine definition identifies the engine and exposes its adapters.

Example:

```js
export const DefaultEngine = {
  key: "default",
  label: "Default",

  AppAdapter,
  PagesAdapter,
  getPagesConfig,
};
```

Additional engines can be added without restructuring the application.

For example:

```text
Engines/
├── Default/
├── EngineTwo/
└── EngineThree/
```

Each engine is then registered in:

```text
src/Engines/index.js
```

The registry allows the application to retrieve an engine using the project's `engineKey`.

---

# Runtime

Runtime contains React state, state setters, functions, references, computed values, APIs, and other application behavior.

Runtime is divided into two levels.

## Global Runtime

```text
src/Runtime/GlobalRuntime.jsx
```

Global runtime contains state and behavior shared across engines.

Examples in a larger application might include:

* active project;
* project lists;
* user information;
* global UI state;
* loading state;
* shared APIs;
* notifications;
* application settings.

The template intentionally keeps the global runtime minimal.

---

## Engine Runtime

Each engine may also have its own runtime.

The default engine uses:

```text
src/Runtime/DefaultRuntime.jsx
```

An engine runtime contains state or behavior that only makes sense for that engine.

Additional engines may therefore introduce:

```text
Runtime/
├── GlobalRuntime.jsx
├── DefaultRuntime.jsx
├── EngineTwoRuntime.jsx
└── EngineThreeRuntime.jsx
```

All runtime hooks are loaded through:

```text
src/Runtime/index.js
```

The runtime index uses a static React hook structure.

For example:

```js
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
```

If additional engines are added, their runtime hooks should also be declared here.

This is important because React hooks cannot be conditionally created after an engine has been selected.

Instead, all runtime hooks exist in a stable order, and `App.jsx` selects the appropriate already-created engine runtime using the project's `engineKey`.

The selected engine runtime is then merged with the global runtime.

Conceptually:

```text
Global Runtime
      +
Selected Engine Runtime
      ↓
Combined Runtime
```

---

# Engine Registry

The engine registry lives at:

```text
src/Engines/index.js
```

It maps engine keys to engine definitions.

Example:

```js
const ENGINE_REGISTRY = {
  default: DefaultEngine,
};
```

A larger application may use:

```js
const ENGINE_REGISTRY = {
  default: DefaultEngine,
  engineTwo: EngineTwo,
  engineThree: EngineThree,
};
```

The active project's `engineKey` selects one of these engines.

---

# Pages Adapter

Each engine defines which workflow pages are available through its `PagesAdapter`.

Example:

```text
Default Engine
│
├── Page 1
├── Page 2
└── Page 3
```

The configuration is exposed through `getPagesConfig()`:

```js
[
  {
    key: "page1",
    path: "page1",
    label: "Page 1",
  },
  {
    key: "page2",
    path: "page2",
    label: "Page 2",
  },
  {
    key: "page3",
    path: "page3",
    label: "Page 3",
  },
]
```

This configuration serves two purposes:

1. defining the navigation available for the active engine;
2. allowing the Header to generate workflow links dynamically.

The `PagesAdapter` then defines which React workflow component is rendered for each route.

Because `PagesAdapter` receives the combined runtime, it also acts as an engine-specific wiring layer.

A future application may use it to decide exactly which runtime values are passed into each workflow.

For example:

```jsx
<Route
  path="/page1"
  element={
    <Page1
      data={runtime.data}
      selectedItem={runtime.selectedItem}
      setSelectedItem={runtime.setSelectedItem}
    />
  }
/>
```

Another engine can use the same route architecture while mounting completely different workflows or passing completely different parameters.

---

# Workflows

Workflow components live in:

```text
src/Workflows/
```

The template contains:

```text
Page1.jsx
Page2.jsx
Page3.jsx
```

A workflow represents a major application screen or functional process.

The engine's `PagesAdapter` decides which workflows belong to that engine.

A real application might replace the generic workflows with names such as:

```text
Viewer
Editor
Reports
Dashboard
Settings
Planning
Analysis
```

or any other application-specific workflows.

A different engine may use an entirely different set of workflow files.

---

# Components

The template includes generic component-group folders:

```text
src/
├── ComponentsGroup1/
├── ComponentsGroup2/
└── ComponentsGroup3/
```

These folders intentionally do not prescribe a particular organization strategy.

Components can be grouped by page:

```text
Team/
Setup/
Output/
```

by function:

```text
Forms/
Filters/
Extensions/
```

by domain:

```text
Accounts/
Inventory/
Reports/
```

or by a combination of these approaches.

For some applications, page and function are effectively the same thing, so organizing components by workflow is appropriate.

For other applications, components are reused across many workflows and are better organized by functional responsibility.

The template leaves this decision to the application.

---

# App Adapter

Each engine may provide an `AppAdapter`.

The `AppAdapter` is for engine-specific components that need to exist at the application level rather than inside a single workflow.

It receives the combined runtime directly from `App.jsx`.

Most applications may not need an app-level adapter at all, but the extension point is available when required.

An example would be a GIS application where a map exists across several workflows.

Different engines might configure or interact with the same application-level map differently, while the map itself remains mounted above the workflow routing layer.

Conceptually:

```text
App.jsx
│
├── Header
│
├── Engine AppAdapter
│   └── Shared engine-level components
│
└── Routes
    └── Engine PagesAdapter
        └── Workflow
```

---

# Why There Usually Are Not Adapters Below the Pages Adapter

This architecture deliberately avoids creating adapters for every individual component.

If an engine requires a substantially different collection of components for a page, that difference usually represents a different workflow.

The `PagesAdapter` can simply mount another workflow.

For example:

```text
Engine A
/output
→ StandardOutput.jsx
```

while another engine could use:

```text
Engine B
/output
→ SpecializedOutput.jsx
```

Creating another `OutputAdapter` underneath both workflows would usually add another abstraction layer without solving a new problem.

Adapters below the workflow level should therefore only be introduced when they solve a genuine cross-engine or cross-workflow problem.

---

# Workspace

Workspace contains application-level UI that is not owned by a particular engine workflow.

The template currently includes:

```text
src/
└── Workspace/
    └── Navigation/
        ├── Header.jsx
        └── Header.css
```

The Header receives `pagesConfig` from the active engine and automatically generates navigation links for that engine's workflows.

Workspace may also contain pages or components that exist independently of the active engine.

Examples might include:

```text
Projects
Account
Login
Community
Application Settings
Project Selection
```

These pages could be routed directly by the application rather than through an engine's `PagesAdapter`.

The template does not include any workspace-level pages yet.

---

# React Router

Routing is handled with React Router.

`BrowserRouter` is mounted around the application in:

```text
src/main.jsx
```

`App.jsx` contains the application's main `Routes` container.

The selected engine contributes workflow routes through its `PagesAdapter`.

The default engine therefore controls both:

* which workflow routes exist;
* which links appear in the Header.

This keeps engine navigation and engine routing synchronized from the same configuration.

---

# Application Layout

The template uses deliberately minimal global styling.

The browser viewport is treated as one full-screen application container.

Conceptually:

```text
Viewport
│
└── App
    │
    ├── Header
    │
    └── Main Layer
        ├── AppAdapter components
        └── Current workflow
```

`index.css` contains only basic global layout rules.

`App.css` establishes the primary application shell.

Individual components and workflows should generally own their own stylesheets rather than relying on a large global stylesheet.

This keeps styling localized and reduces unintended interactions between unrelated components.

---

# Local Data Placeholder

The template contains a minimal root-level data directory:

```text
Data/
└── Projects/
    └── defaultProject.json
```

The default project contains only the information required to select an engine.

Example:

```json
{
  "name": "Default Project",
  "engineKey": "default"
}
```

This is not intended to be a real database.

It provides a minimal local project that allows the engine/runtime architecture to operate without requiring any external services.

A real application could later replace this with:

* MongoDB;
* PostgreSQL;
* SQLite;
* local filesystem storage;
* REST APIs;
* GraphQL;
* cloud databases;
* another persistence layer.

Projects and engines are separate concepts.

Two projects can use the same engine while containing completely different data.

The engine determines **how the application handles the project**.

The project contains **the particular data and configuration being handled**.

---

# No Backend Included

This template intentionally does not include:

* a Node or Express server;
* API routes;
* authentication;
* user accounts;
* database connections;
* cloud hosting configuration;
* provider credentials;
* external service integrations.

Those systems are highly application-specific.

Including them in a generic frontend architecture template would add dependencies and assumptions while providing little reusable benefit.

Instead, the template is intended to remain lightweight.

A developer can clone the repository, install dependencies, and immediately run the React application locally.

Backend infrastructure can then be added according to the application's actual requirements.

A future project could add folders such as:

```text
Server/
Data/
src/
```

and connect the frontend to a local or remote backend without changing the engine/workflow architecture.

---

# Running Locally

Clone or download the repository.

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

---

# Adding Another Engine

To create another engine:

1. Create a new engine folder under `src/Engines/`.

```text
Engines/
└── NewEngine/
    ├── engine.js
    ├── PagesAdapter.jsx
    └── AppAdapter.jsx
```

2. Create an engine-specific runtime.

```text
Runtime/
└── NewEngineRuntime.jsx
```

3. Add the runtime hook to:

```text
src/Runtime/index.js
```

All runtime hooks should remain statically declared.

4. Register the engine in:

```text
src/Engines/index.js
```

5. Set a project's `engineKey` to the new engine key.

For example:

```json
{
  "name": "Example Project",
  "engineKey": "newEngine"
}
```

6. Define the workflows for that engine through its `PagesAdapter`.

The application shell does not need to be rewritten.

---

# Design Principle

The central idea of this template is:

```text
Project selects Engine

Engine selects behavior

Runtime supplies state

PagesAdapter selects workflows

Workflow selects components

Workspace supplies application-level UI
```

This allows an application to grow across multiple project types without placing all project-specific behavior directly inside `App.jsx`.

The template intentionally provides only the architecture required to demonstrate that pattern and leaves application-specific functionality to the projects built from it.
