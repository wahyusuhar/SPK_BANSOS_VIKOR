import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

console.log("[API] Initializing...");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check to verify API is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Setup routes
registerRoutes(httpServer, app);

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
