import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(httpServer: Server, app: Express): Server {
  // No auth setup needed anymore

  app.get("/api/debug", (req, res) => {
    res.json({
      status: "ok",
      message: "Server is running (No Auth Mode)",
      timestamp: new Date().toISOString(),
    });
  });

  return httpServer;
}
