import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
// import session from "express-session";
// import passport from "passport";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
// import { configureSocialAuth } from "../socialAuth";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, getSessionCookieOptions } from "./cookies";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Session configuration for Passport (disabled)
  /*
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );
  */
  
  // Initialize Passport (disabled)
  // app.use(passport.initialize());
  // app.use(passport.session());
  
  // Configure social auth strategies (disabled)
  // const baseUrl = process.env.NODE_ENV === 'production'
  //   ? process.env.BASE_URL || 'https://ai-learning-curve.vercel.app'
  //   : 'http://localhost:3000';
  // configureSocialAuth(baseUrl);
  
  // Import rate limiters
  const { apiRateLimiter } = await import("../rateLimiter");
  
  // Apply general API rate limiting
  app.use("/api", apiRateLimiter);
  
  // Social auth routes (disabled)
  /*
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
    (req, res) => {
      // Create JWT token
      const user = req.user as any;
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
      
      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, cookieOptions);
      
      res.redirect('/dashboard');
    }
  );
  
  app.get('/api/auth/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
  app.get('/api/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login?error=microsoft_auth_failed' }),
    (req, res) => {
      // Create JWT token
      const user = req.user as any;
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
      
      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, cookieOptions);
      
      res.redirect('/dashboard');
    }
  );
  
  app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_auth_failed' }),
    (req, res) => {
      // Create JWT token
      const user = req.user as any;
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
      
      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, cookieOptions);
      
      res.redirect('/dashboard');
    }
  );
  */
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
