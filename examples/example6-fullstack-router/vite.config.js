import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  //root: "frontend",
  root: resolve(__dirname, "frontend"),

  esbuild: {
    jsxFactory: "h", // ✅ tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // ✅ tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment, WebMVCComponent, WebMVCModel, WebMVCRouter } from 'web-mvc-js';`, // ✅ injects the import automatically

    // Uncomment the line below if you want to use the automatic import feature
    //jsxImportSource: 'framework/jsx-runtime', // ✅ your shim
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "frontend/main.jsx"),
      },
    },

    // Enable source maps to help with debugging
    sourcemap: true,

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // need @pages defined to use the router for file based routing
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
      "@pages": resolve(__dirname, "frontend/pages"),
    },
  },
});
