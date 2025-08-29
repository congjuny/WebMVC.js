/*!
 * Copyright (c) 2025 Congjun Yang
 * License: MIT
 *
 * Rollup configuration for WebMVC.js
 */

import { defineConfig } from "rollup";

export default defineConfig({
  input: "./src/wmvc-runtime.js",
  output: {
    dir: "./dist",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
  },
});
