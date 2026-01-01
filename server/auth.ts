import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";

// Hardcoded admin user for robust fallback
const ADMIN_USER = {
  id: "admin-id",
  username: "admin",
  password: "admin",
};

export function setupAuth(app: Express) {
  // 1. PENTING UNTUK VERCEL: Trust Proxy harus di-set sebelum session
  // Vercel menggunakan proxy, jadi Express perlu mempercayai header X-Forwarded-Proto
  app.set("trust proxy", 1);

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    // 2. Konfigurasi Cookie untuk Production/Vercel
    cookie: {
      secure: process.env.NODE_ENV === "production", // Wajib true jika di HTTPS (Vercel default HTTPS)
      sameSite: "lax", // Disarankan 'lax' atau 'none'
      maxAge: 24 * 60 * 60 * 1000, // 24 jam
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Direct check against hardcoded admin first
        if (
          username === ADMIN_USER.username &&
          password === ADMIN_USER.password
        ) {
          return done(null, ADMIN_USER);
        }

        // Fallback to storage if needed
        const user = await storage.getUserByUsername(username);
        if (!user || user.password !== password) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      if (id === ADMIN_USER.id) {
        return done(null, ADMIN_USER);
      }
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    res.status(403).send("Registrasi dinonaktifkan. Gunakan akun admin.");
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(400).send("Invalid username or password");
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.get("/api/registration-status", async (req, res) => {
    // Pastikan storage.getUserCount() tidak error jika belum ada db
    try {
      const count = await storage.getUserCount();
      res.json({ canRegister: count === 0 });
    } catch (error) {
       // Fallback jika storage error
      res.json({ canRegister: false });
    }
  });
}