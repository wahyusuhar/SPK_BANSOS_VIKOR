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

  // 2. Setup Session dengan Fallback Aman
  // Jika storage.sessionStore bermasalah/undefined, express-session akan otomatis
  // menggunakan MemoryStore (default) yang aman agar server tidak crash.
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore, // Pastikan ini tidak melempar error di storage.ts
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      maxAge: 24 * 60 * 60 * 1000, // 24 jam
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[Auth] Attempting login for: ${username}`);

        // 1. Cek Admin Hardcoded DULU (Bypass Database)
        if (
          username === ADMIN_USER.username &&
          password === ADMIN_USER.password
        ) {
          console.log("[Auth] Admin login success (Hardcoded)");
          return done(null, ADMIN_USER);
        }

        // 2. Coba cek Database (Dibungkus Try-Catch ketat)
        try {
          const user = await storage.getUserByUsername(username);
          if (!user || user.password !== password) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (dbError) {
          console.error("[Auth] Database error during login check:", dbError);
          // Jika DB error, tapi bukan admin, gagalkan login dengan aman
          return done(null, false); 
        }

      } catch (err) {
        console.error("[Auth] Critical Strategy Error:", err);
        return done(err);
      }
    }),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      // 1. Cek Admin Hardcoded
      if (id === ADMIN_USER.id) {
        return done(null, ADMIN_USER);
      }
      
      // 2. Cek Database dengan Error Handling
      try {
        const user = await storage.getUser(id);
        done(null, user);
      } catch (dbError) {
        console.error(`[Auth] Failed to deserialize user ${id}:`, dbError);
        // Jangan crash, kembalikan null agar user logout otomatis
        done(null, null);
      }
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
      if (err) {
        console.error("[Auth] Login Route Error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(400).send("Invalid username or password");
      }
      req.login(user, (err) => {
        if (err) {
          console.error("[Auth] req.login Error:", err);
          return next(err);
        }
        // Kirim response JSON bersih
        return res.status(200).json({ id: user.id, username: user.username, role: user.role || 'admin' });
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
    try {
      // Bungkus ini agar jika DB belum connect, halaman tidak error 500 total
      const count = await storage.getUserCount();
      res.json({ canRegister: count === 0 });
    } catch (error) {
      console.warn("[Auth] Warning: Could not fetch user count (DB issue?). Defaulting to false.");
      // Fallback: anggap sudah ada user (admin) supaya tidak muncul tombol register
      res.json({ canRegister: false });
    }
  });
}