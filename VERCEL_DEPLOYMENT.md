# Vercel Deployment Guide

This guide will help you deploy the AI Learning Curve platform to Vercel with email/password authentication.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- TiDB Cloud database (already set up - see DATABASE_SETUP.md)

## Step 1: Push Code to GitHub

1. Download the project files from Manus
2. Extract and navigate to the project folder
3. Initialize Git and push to GitHub:

```bash
cd ai_learning_curve
git init
git add .
git commit -m "Initial commit: AI Learning Curve with email/password auth"
git branch -M main
git remote add origin https://github.com/pcarikas-code/ai-learning-curve.git
git push -u origin main
```

## Step 2: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository: `pcarikas-code/ai-learning-curve`
5. Click "Import"

## Step 3: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: None (or Other)
- **Build Command**: `pnpm vercel-build`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`

## Step 4: Add Environment Variables

Click "Environment Variables" and add the following:

### Required Variables

```
DATABASE_URL=mysql://2xXUA2GWModsgbc.root:XEzVpe5kDhpLddhe@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}

JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

NODE_ENV=production
```

**Important Notes:**

1. **DATABASE_URL**: Use the connection string from DATABASE_SETUP.md (includes TLS configuration)
2. **JWT_SECRET**: Generate a strong random string (at least 32 characters). You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Set all variables for **Production**, **Preview**, and **Development** environments

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (~2-3 minutes)
3. Once deployed, you'll get a URL like: `https://ai-learning-curve.vercel.app`

## Step 6: Test the Deployment

1. Visit your Vercel URL
2. Click "Sign Up" or navigate to `/register`
3. Create a new account
4. Test login and authentication flow

## Authentication System

The platform uses **email/password authentication**:

- **Registration**: `/register` - Create new account
- **Login**: `/login` - Sign in with email/password
- **Session**: JWT tokens stored in HTTP-only cookies (7-day expiration)
- **Password**: Hashed with bcrypt (10 rounds)

## Troubleshooting

### Build Fails

**Error**: "Cannot find module 'bcryptjs'"
- **Solution**: Ensure `bcryptjs` and `jsonwebtoken` are in `dependencies` in `package.json`

**Error**: "DATABASE_URL is not defined"
- **Solution**: Double-check environment variables in Vercel dashboard

### Runtime Errors

**Error**: "Invalid email or password"
- **Solution**: Ensure you're using the correct credentials

**Error**: "Database connection failed"
- **Solution**: Verify DATABASE_URL is correct and includes SSL parameters

## Security Recommendations

1. **JWT_SECRET**: Use a strong random string (32+ characters)
2. **HTTPS**: Vercel automatically provides SSL certificates
3. **Rate Limiting**: Consider adding rate limiting to auth endpoints
4. **Password Policy**: Current minimum is 6 characters

## Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- TiDB Cloud Support: https://docs.pingcap.com/tidbcloud

Congratulations! Your AI Learning Curve platform is now live on Vercel! 🎉
