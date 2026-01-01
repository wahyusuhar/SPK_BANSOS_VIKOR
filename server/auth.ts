import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage, User } from "./storage";

// Extend express-session to include user
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export function setupAuth(app: Express) {
  // Simple memory store for sessions
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));

  // Middleware to simulate req.user from passport
  app.use((req: any, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
      req.isAuthenticated = () => true;
    } else {
      req.user = undefined;
      req.isAuthenticated = () => false;
    }
    next();
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log(`[Auth] Login attempt: ${username}`);

      const user = await storage.getUserByUsername(username);

      if (user && user.password === password) {
        req.session.user = user;
        req.session.save((err) => {
          if (err) {
            console.error("[Auth] Session save error:", err);
            return res.status(500).send("Session error");
          }
          console.log("[Auth] Login success");
          return res.status(200).json(user);
        });
      } else {
        console.log("[Auth] Login failed: Invalid credentials");
        return res.status(401).send("Invalid username or password");
      }
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.status(500).send("Internal Server Error during login");
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).send("Logout failed");
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req: any, res) => {
    if (!req.user) return res.sendStatus(401);
    res.json(req.user);
  });

  app.get("/api/registration-status", async (req, res) => {
    try {
      const count = await storage.getUserCount();
      res.json({ canRegister: count === 0 });
    } catch (error) {
      console.error("[Auth] Registration status error:", error);
      res.status(500).json({ message: "Error checking status" });
    }
  });

  app.post("/api/register", (req, res) => {
    res.status(403).send("Registrasi dinonaktifkan.");
  });
}
