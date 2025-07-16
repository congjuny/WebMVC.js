import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  esbuild: {
    jsxFactory: "h", // ✅ tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // ✅ tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment } from 'web-mvc-js';`, // ✅ injects the import automatically

    // Uncomment the line below if you want to use the automatic import feature
    //jsxImportSource: 'framework/jsx-runtime', // ✅ your shim
  },
  resolve: {
    alias: {
      "@framework": path.resolve(__dirname, "./framework"),
    },
  },
});
