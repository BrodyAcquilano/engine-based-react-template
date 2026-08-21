import AppAdapter from "./AppAdapter.jsx";
import {
  PagesAdapter,
  getPagesConfig,
} from "./PagesAdapter.jsx";

export const DefaultEngine = {
  key: "default",
  label: "Default",

  AppAdapter,
  PagesAdapter,
  getPagesConfig,
};