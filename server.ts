import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cron from "node-cron";
import geoip from "geoip-lite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://picsum.photos https://images.unsplash.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;");
    next();
  });

  // API Route to capture visitor info
  app.post("/api/track", (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8';
    if (Array.isArray(ip)) ip = ip[0];
    
    // Normalize IP for geoip
    const cleanIp = ip.split(',')[0].trim();
    const geo = geoip.lookup(cleanIp);
    const location = geo ? `${geo.city}, ${geo.country}` : "Unknown Location";
    const country = geo ? geo.country : "Unknown";

    console.log(`Visitor captured: IP=${cleanIp}, Location=${location}, UA=${req.headers['user-agent']}`);
    res.json({ success: true, ip: cleanIp, location, country });
  });

  // Health Optimization Cron Job (Simulated)
  // Runs every day at midnight
  cron.schedule('0 0 * * *', () => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Running scheduled health optimization (SSO, GEO, SEO, LLM)...`);
    // Automation: Sync sitemap, check SSL, refresh LLM embeddings
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
