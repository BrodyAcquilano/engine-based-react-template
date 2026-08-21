import { Route } from "react-router";

import Page1 from "../../Workflows/Page1.jsx";
import Page2 from "../../Workflows/Page2.jsx";
import Page3 from "../../Workflows/Page3.jsx";

export function getPagesConfig() {
  return [
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
  ];
}

export function PagesAdapter({ runtime }) {
  if (!runtime) return null;

  return (
    <>
      <Route
        path="/page1"
        element={<Page1 />}
      />

      <Route
        path="/page2"
        element={<Page2 />}
      />

      <Route
        path="/page3"
        element={<Page3 />}
      />
    </>
  );
}