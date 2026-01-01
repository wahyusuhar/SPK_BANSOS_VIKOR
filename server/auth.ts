import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";

// Define User interface locally to avoid dependencies
interface User {
  id: string;
  username: string;
  password: string;
  role?: string;
}

// Hardcoded admin user for guaranteed access
const ADMIN_USER: User = {
  id: "admin-id-123",
  username: "admin",
  password: "admin",
  role: "admin",
};

// Extend express-session to include user
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export function setupAuth(app: Express) {
  console.log("[Auth] Setting up authentication...");

  // Simple memory store for sessions
  const sessionSettings: session.SessionOptions = {
    secret: "super_secret_key_fixed_12345", // Hardcoded secret for stability
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(), // Direct instantiation
    cookie: {
      secure: false, // Set to false to ensure it works on both http/https for now
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    // sessionSettings.cookie.secure = true; // Keep false for now to avoid https mismatch issues
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
    try {
      const { username, password } = req.body;

      console.log(`[Auth] Login attempt: ${username}`);

      // Direct comparison with hardcoded user
      if (
        username === ADMIN_USER.username &&
        password === ADMIN_USER.password
      ) {
        req.session.user = ADMIN_USER;
        req.session.save((err) => {
          if (err) {
            console.error("[Auth] Session save error:", err);
            return res.status(500).send("Session error");
          }
          console.log("[Auth] Login success");
          return res.status(200).json(ADMIN_USER);
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

  app.get("/api/registration-status", (req, res) => {
    // Always return false for registration to prevent issues
    res.json({ canRegister: false });
  });

  app.post("/api/register", (req, res) => {
    res.status(403).send("Registrasi dinonaktifkan.");
  });

  console.log("[Auth] Authentication setup complete");
}
