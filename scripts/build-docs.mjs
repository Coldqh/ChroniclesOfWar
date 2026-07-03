import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const distDir = resolve(root, "dist");
const docsDir = resolve(root, "docs");

if (!existsSync(distDir)) {
  throw new Error("dist folder was not found. Run npm run build before building docs.");
}

rmSync(docsDir, { recursive: true, force: true });
mkdirSync(docsDir, { recursive: true });

cpSync(distDir, docsDir, { recursive: true });
writeFileSync(resolve(docsDir, ".nojekyll"), "");

console.log("docs folder rebuilt from dist");
