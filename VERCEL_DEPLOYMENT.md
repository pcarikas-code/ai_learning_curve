# Vercel Deployment Guide for AI Learning Curve

This guide will help you deploy the AI Learning Curve platform to Vercel through GitHub.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. A MySQL/TiDB database (PlanetScale, TiDB Cloud, or similar)
4. Required API keys and credentials

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Connect to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the framework settings

## Step 3: Configure Build Settings

Vercel should automatically detect the configuration from `vercel.json`, but verify:

- **Framework Preset**: Other
- **Build Command**: `pnpm vercel-build`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`
- **Node Version**: 20.x

## Step 4: Set Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Database Variables

```
DATABASE_URL=mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
```

### Required Auth Variables

```
JWT_SECRET=your-secure-random-jwt-secret-min-32-chars
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-manus-app-id
```

### Required Owner Variables

```
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name
```

### Required Forge API Variables

```
BUILT_IN_FORGE_API_URL=https://forge-api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge-api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
```

### Optional Analytics Variables

```
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### Optional Branding Variables

```
VITE_APP_TITLE=AI Learning Curve
VITE_APP_LOGO=/logo.png
```

## Step 5: Run Database Migrations

Before deploying, you need to push your database schema:

1. Set the `DATABASE_URL` in your local `.env` file
2. Run migrations:
   ```bash
   pnpm db:push
   ```
3. Seed achievements:
   ```bash
   pnpm tsx server/seedAchievements.ts
   ```

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Vercel will provide you with a deployment URL

## Step 7: Configure Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS records

## Post-Deployment Checklist

- [ ] Test user authentication (OAuth login)
- [ ] Verify database connection
- [ ] Test module and quiz functionality
- [ ] Check achievement system
- [ ] Verify file uploads work
- [ ] Test responsive design on mobile
- [ ] Check all API endpoints
- [ ] Monitor error logs in Vercel dashboard

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify Node version is 20.x

### Database Connection Issues

- Ensure `DATABASE_URL` is correct and includes SSL parameters
- Check if your database allows connections from Vercel's IP ranges
- For PlanetScale: Enable "Automatically copy migration data" in settings

### OAuth Not Working

- Verify `OAUTH_SERVER_URL` and `VITE_OAUTH_PORTAL_URL` are correct
- Check `VITE_APP_ID` matches your Manus application
- Ensure callback URL in Manus settings includes your Vercel domain

### API Routes 404

- Check that `vercel.json` rewrites are configured correctly
- Verify the `api/index.ts` file exists and is properly configured

## Environment-Specific Notes

### Development vs Production

The app automatically detects the environment:
- Development: Uses `NODE_ENV=development`
- Production: Vercel sets `NODE_ENV=production` automatically

### Database Migrations

- Run migrations locally before deploying
- Consider using a migration service for production
- Always backup your database before running migrations

## Support

For Vercel-specific issues:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

For application issues:
- Check the GitHub repository issues
- Review application logs in Vercel dashboard
