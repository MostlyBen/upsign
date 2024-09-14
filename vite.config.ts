import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const config = defineConfig({
  plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths()],
});

export default config;
