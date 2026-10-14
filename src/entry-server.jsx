import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

// Used at build time only (scripts/prerender.js): renders the page to HTML so
// the content is in index.html for search engines and link previews.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
