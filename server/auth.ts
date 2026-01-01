import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";

// Hardcoded admin user
const ADMIN_USER = {
  id: "admin-id",
  username: "admin",
  password: "admin",
};

// Extend express-session to include user
declare module "express-session" {
  interface SessionData {
    user: typeof ADMIN_USER;
  }
}

export function setupAuth(app: Express) {
  // Simple memory store for sessions
  // In Vercel serverless, this will reset on every function restart (cold start)
  // but it should work for a single session during a warm period.
  // For persistent sessions in production, we'd need Redis/Postgres store.
  // But for this demo/fix, we accept ephemeral sessions.
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
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

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    console.log(`Login attempt: ${username}`);

    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      req.session.user = ADMIN_USER;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Session error");
        }
        console.log("Login success");
        return res.status(200).json(ADMIN_USER);
      });
    } else {
      console.log("Login failed");
      return res.status(401).send("Invalid username or password");
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

  app.get("/api/registration-status", (req, res) => {
    res.json({ canRegister: false });
  });

  app.post("/api/register", (req, res) => {
    res.status(403).send("Registrasi dinonaktifkan.");
  });
}
