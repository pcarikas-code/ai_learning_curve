import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import superjson from 'superjson';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// tRPC endpoint
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth callback
app.get('/api/oauth/callback', async (req, res) => {
  // Import OAuth handler
  const { handleOAuthCallback } = await import('../server/_core/oauth');
  return handleOAuthCallback(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};
