import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "h", // ✅ tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // ✅ tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment, Router } from 'web-mvc-js';`, // ✅ injects the import automatically

    // Uncomment the line below if you want to use the automatic import feature
    //jsxImportSource: 'framework/jsx-runtime', // ✅ your shim
  },
  resolve: {},
});
