import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The built site already contains the pre-rendered page; the dev server doesn't.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
