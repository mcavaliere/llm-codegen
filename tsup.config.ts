import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  publicDir: false,
  clean: true,
  minify: true,
  format: ["esm"],
});
