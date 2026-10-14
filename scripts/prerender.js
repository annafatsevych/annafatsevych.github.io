// Runs after `vite build`: puts the rendered page into dist/index.html.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { render } from "../dist-ssr/entry-server.js";

const file = "dist/index.html";
const html = readFileSync(file, "utf8");
if (!html.includes("<!--app-html-->")) throw new Error("index.html is missing the <!--app-html--> placeholder");
writeFileSync(file, html.replace("<!--app-html-->", render()));
rmSync("dist-ssr", { recursive: true, force: true });
console.log("Pre-rendered dist/index.html");
