import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";
import { MicrosoftOAuthService } from "./microsoftOAuth";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Debug endpoint to show redirect URI
  app.get("/api/auth/debug-redirect", (req: Request, res: Response) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
    res.json({
      protocol: req.protocol,
      host: req.get('host'),
      redirectUri,
      headers: {
        'x-forwarded-proto': req.get('x-forwarded-proto'),
        'x-forwarded-host': req.get('x-forwarded-host'),
      }
    });
  });

  // Direct Microsoft OAuth integration (disabled)
  /*
  app.get("/api/auth/microsoft", (req: Request, res: Response) => {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const tenantId = process.env.MICROSOFT_TENANT_ID;

    if (!clientId || !clientSecret || !tenantId) {
      res.status(500).json({ error: "Microsoft OAuth not configured" });
      return;
    }

    // Use hardcoded production domain to ensure consistency
    const redirectUri = 'https://theailearningcurve.com/api/oauth/callback';
    const microsoftOAuth = new MicrosoftOAuthService(clientId, clientSecret, tenantId, redirectUri);
    
    // Generate random state for CSRF protection
    const state = randomBytes(32).toString('hex');
    
    // Store state in session/cookie for verification (simplified - in production use Redis/session store)
    res.cookie('oauth_state', state, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600000 }); // 10 min
    
    const authUrl = microsoftOAuth.getAuthorizationUrl(state);
    res.redirect(302, authUrl);
  });
  */

  /*
  app.get("/api/auth/google", (req: Request, res: Response) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
    const state = Buffer.from(redirectUri).toString('base64');
    const oauthUrl = `${ENV.oAuthPortalUrl}?client_id=${ENV.appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&platform=google`;
    res.redirect(302, oauthUrl);
  });

  app.get("/api/auth/facebook", (req: Request, res: Response) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/callback`;
    const state = Buffer.from(redirectUri).toString('base64');
    const oauthUrl = `${ENV.oAuthPortalUrl}?client_id=${ENV.appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&platform=facebook`;
    res.redirect(302, oauthUrl);
  });
  */

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      // Check if this is a direct Microsoft OAuth callback
      const storedState = req.cookies?.oauth_state;
      
      if (storedState && storedState === state) {
        // Direct Microsoft OAuth flow
        const clientId = process.env.MICROSOFT_CLIENT_ID;
        const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
        const tenantId = process.env.MICROSOFT_TENANT_ID;

        if (!clientId || !clientSecret || !tenantId) {
          res.status(500).json({ error: "Microsoft OAuth not configured" });
          return;
        }

        // Use hardcoded production domain to ensure consistency
        const redirectUri = 'https://theailearningcurve.com/api/oauth/callback';
        const microsoftOAuth = new MicrosoftOAuthService(clientId, clientSecret, tenantId, redirectUri);
        
        // Exchange code for token
        console.log('[Microsoft OAuth] Exchanging code for token...');
        const tokenResponse = await microsoftOAuth.exchangeCodeForToken(code);
        console.log('[Microsoft OAuth] Token exchange successful');
        
        // Get user info from Microsoft Graph
        console.log('[Microsoft OAuth] Fetching user info from Microsoft Graph...');
        const userInfo = await microsoftOAuth.getUserInfo(tokenResponse.access_token);
        console.log('[Microsoft OAuth] User info retrieved:', { email: userInfo.mail || userInfo.userPrincipalName, name: userInfo.displayName });
        
        // Create or update user in database
        const email = userInfo.mail || userInfo.userPrincipalName;
        const name = userInfo.displayName || userInfo.givenName || 'User';
        
        await db.upsertUser({
          email,
          name,
          loginMethod: 'microsoft',
          lastSignedIn: new Date(),
        });
        
        // Get user from database to get the ID
        const database = await db.getDb();
        if (!database) {
          res.status(500).json({ error: "Database not available" });
          return;
        }
        
        const { users } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const userResult = await database.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (userResult.length === 0) {
          res.status(500).json({ error: "Failed to create user" });
          return;
        }
        
        const user = userResult[0];
        
        // Create JWT session token
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
        const sessionToken = jwt.sign(
          { userId: user.id, email: user.email },
          jwtSecret,
          { expiresIn: '365d' }
        );
        
        // Clear OAuth state cookie
        res.clearCookie('oauth_state');
        
        // Set session cookie
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        
        res.redirect(302, "/");
      } else {
        // Fallback to Manus OAuth flow
        const tokenResponse = await sdk.exchangeCodeForToken(code, state);
        const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

        if (!userInfo.openId) {
          res.status(400).json({ error: "openId missing from user info" });
          return;
        }

        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || 'User',
          email: userInfo.email || '',
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? 'oauth',
          lastSignedIn: new Date(),
        });

        const sessionToken = await sdk.createSessionToken(userInfo.openId, {
          name: userInfo.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.redirect(302, "/");
      }
    } catch (error: any) {
      console.error("[OAuth] Callback failed", error);
      console.error("[OAuth] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      res.status(500).json({ 
        error: "OAuth callback failed",
        details: error.message,
        microsoft_error: error.response?.data,
        status: error.response?.status
      });
    }
  });
}
