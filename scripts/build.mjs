// Single build entry point.
//
// On Lovable / Cloudflare (publishing from the platform) it runs the normal
// server build. Anywhere else - i.e. on your own machine or on the cPanel
// server - it produces a fully static site and puts it straight into `dist/`,
// so `dist/` contents can be uploaded into public_html as-is.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const isLovable =
  !!process.env["LOVABLE_SANDBOX"] ||
  !!process.env["DEV_SERVER__PROJECT_PATH"] ||
  !!process.env["CF_PAGES"] ||
  !!process.env["VERCEL"] ||
  process.env["LOVABLE_BUILD"] === "server" ||
  process.env["BUILD_TARGET"] === "server";

const args = isLovable ? ["build"] : ["build", "--config", "vite.config.static.ts"];

const env = { ...process.env };
if (!isLovable) {
  delete env["DEV_SERVER__PROJECT_PATH"];
  delete env["LOVABLE_SANDBOX"];
}

const result = spawnSync("vite", args, { stdio: "inherit", env, shell: true });
if (result.status !== 0) process.exit(result.status ?? 1);

if (isLovable) process.exit(0);

// Flatten dist/client -> dist so the folder can be uploaded directly.
const root = process.cwd();
const client = resolve(root, "dist/client");
if (existsSync(client)) {
  cpSync(client, resolve(root, "dist"), { recursive: true });
  rmSync(client, { recursive: true, force: true });
  rmSync(resolve(root, "dist/server"), { recursive: true, force: true });
  rmSync(resolve(root, "dist/_worker.js"), { recursive: true, force: true });
}

// TanStack's static pass can leave deployment metadata at the dist root.
// Shared hosting does not need these files and may mistake them for a Node app.
rmSync(resolve(root, "dist/nitro.json"), { force: true });
rmSync(resolve(root, "dist/package.json"), { force: true });
rmSync(resolve(root, "dist/package-lock.json"), { force: true });

const files = existsSync(resolve(root, "dist")) ? readdirSync(resolve(root, "dist")) : [];
console.log(
  `\nStatic site ready in dist/ (${files.length} entries). Upload the CONTENTS of dist/ into public_html, including the hidden .htaccess file.\n`,
);
