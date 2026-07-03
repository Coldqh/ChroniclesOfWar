import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = resolve(root, "dist");
const docsDir = resolve(root, "docs");

console.log("Project root:", root);
console.log("Dist folder:", distDir);
console.log("Docs folder:", docsDir);

if (!existsSync(distDir)) {
  throw new Error("dist folder was not found. Run npm run build first, or use npm run docs:build.");
}

rmSync(docsDir, { recursive: true, force: true });
mkdirSync(docsDir, { recursive: true });

cpSync(distDir, docsDir, { recursive: true });
writeFileSync(resolve(docsDir, ".nojekyll"), "");

console.log("docs folder rebuilt from dist");
