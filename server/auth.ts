import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";

// Hardcoded admin user (Penyelamat jika Database Error)
const ADMIN_USER = {
  id: "admin-id",
  username: "admin",
  password: "admin",
};

export function setupAuth(app: Express) {
  // 1. Trust Proxy (Wajib untuk Vercel)
  app.set("trust proxy", 1);

  // 2. Setup Session
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      // Di Vercel production gunakan secure (HTTPS), tapi di local tidak.
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", // Lax lebih aman agar cookie terkirim saat navigasi
      maxAge: 24 * 60 * 60 * 1000, // 24 jam
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // 1. Cek Admin Hardcoded DULU
        if (
          username === ADMIN_USER.username &&
          password === ADMIN_USER.password
        ) {
          return done(null, ADMIN_USER);
        }

        // 2. Cek Storage
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

  // --- ROUTES ---

  app.post("/api/register", async (req, res) => {
    res.status(403).send("Registrasi dinonaktifkan. Gunakan akun admin.");
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(400).send("Invalid username or password");
      
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ 
            id: user.id, 
            username: user.username, 
            role: user.role || 'admin' 
        });
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
    // Karena kita pakai memory storage, anggap saja tidak bisa register
    // agar user dipaksa login pakai admin
    res.json({ canRegister: false });
  });
}