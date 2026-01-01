import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export function registerRoutes(httpServer: Server, app: Express): Server {
  setupAuth(app);

  app.get("/api/debug", (req, res) => {
    res.json({
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  return httpServer;
}
