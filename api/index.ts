import express, { Request, Response, NextFunction } from "express";
import session from "express-session";

// --- Types ---
interface User {
  id: string;
  username: string;
  password: string;
  role?: string;
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// --- Constants ---
const ADMIN_USER: User = {
  id: "admin-id-123",
  username: "admin",
  password: "admin",
  role: "admin",
};

const app = express();

console.log("[API] Initializing isolated auth instance...");

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Session Setup ---
// Note: MemoryStore in Vercel is ephemeral. Sessions will be lost on function cold start.
// This is acceptable for a "dummy" login fix request, but for production, use Redis.
const sessionMiddleware = session({
  secret: "super_fixed_secret_key_12345",
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(),
  cookie: {
    secure: false, // Set to true if HTTPS is guaranteed and handled correctly by proxy
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

app.use(sessionMiddleware);

// --- Auth Simulation Middleware ---
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

// --- Routes ---

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[API] Login attempt for: ${username}`);

    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      req.session.user = ADMIN_USER;
      req.session.save((err) => {
        if (err) {
          console.error("[API] Session save error:", err);
          return res.status(500).send("Session save failed");
        }
        console.log("[API] Login success");
        return res.status(200).json(ADMIN_USER);
      });
    } else {
      console.log("[API] Invalid credentials");
      return res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error("[API] Login handler error:", error);
    res.status(500).send("Internal login error");
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

// --- Global Error Handler ---
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[API] Uncaught error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
