import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://annafatsevych.com/ (the CV lives separately at /cv/)
export default defineConfig({
  base: "/",
  plugins: [react()],
});
