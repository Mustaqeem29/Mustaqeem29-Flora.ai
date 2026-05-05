import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Vite Integration for the frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Check if requested path is one of our static HTML files
      const cleanPath = req.path === '/' ? '/index.html' : req.path;
      const fullPath = path.join(distPath, cleanPath.endsWith('.html') ? cleanPath : `${cleanPath}.html`);
      
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) res.status(404).send('Not Found');
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\x1b[32m%s\x1b[0m`, `[SERVER] Neural Link active at http://localhost:${PORT}`);
  });
}

startServer();
