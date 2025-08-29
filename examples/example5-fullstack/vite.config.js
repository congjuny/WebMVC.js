import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",

  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },

  esbuild: {
    jsxFactory: "h", // ✅ tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // ✅ tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment} from 'web-mvc-js';`, // ✅ injects the import automatically
  },
  resolve: {},
});
