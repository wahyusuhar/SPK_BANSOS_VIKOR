import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";

// Hardcoded admin user for robust fallback
const ADMIN_USER = {
  id: "admin-id",
  username: "admin",
  password: "admin",
};

export function setupAuth(app: Express) {
  // Use default MemoryStore by not specifying store
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "very_secret_session_secret_123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: app.get("env") === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Attempting login for: ${username}`);
        if (
          username === ADMIN_USER.username &&
          password === ADMIN_USER.password
        ) {
          console.log("Admin login successful");
          return done(null, ADMIN_USER);
        }
        console.log("Login failed: Invalid credentials");
        return done(null, false);
      } catch (err) {
        console.error("Login error:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      if (id === ADMIN_USER.id) {
        return done(null, ADMIN_USER);
      }
      done(null, false);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", (req, res) => {
    res.status(403).send("Registrasi dinonaktifkan. Gunakan akun admin.");
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Passport auth error:", err);
        return next(err);
      }
      if (!user) {
        return res.status(400).send("Invalid username or password");
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Req login error:", err);
          return next(err);
        }
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

  app.get("/api/registration-status", (req, res) => {
    res.json({ canRegister: false });
  });
}
