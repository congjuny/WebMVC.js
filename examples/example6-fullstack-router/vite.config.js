import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  //root: "frontend",
  root: resolve(__dirname, "frontend"),

  esbuild: {
    jsxFactory: "h", // ✅ tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // ✅ tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment, WebMVCComponent, WebMVCModel, WebMVCRouter } from 'web-mvc-js';`, // ✅ injects the import automatically
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,

    // Enable source maps to help with debugging
    sourcemap: true,

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
