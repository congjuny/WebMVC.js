// server.mjs

import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());

// API routes
app.use("/api", (await import("./backend/api.js")).default);

// Let Vite handle everything else (HTML, JS, CSS, client routing)
ViteExpress.listen(app, 3000, () => {
  console.log("Server running at http://localhost:3000");
});
