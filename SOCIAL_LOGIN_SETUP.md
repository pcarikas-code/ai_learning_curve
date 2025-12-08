# Social Login Setup Guide

This guide explains how to configure Google, Microsoft, and Facebook OAuth for the AI Learning Curve platform.

## Overview

The platform supports three social login providers:
- **Google OAuth 2.0**
- **Microsoft OAuth 2.0**
- **Facebook Login**

All social logins automatically verify user emails and create accounts if they don't exist.

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: `AI Learning Curve`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`
5. Save and continue

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `AI Learning Curve Web`
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### 4. Add Environment Variables

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## Microsoft OAuth Setup

### 1. Register Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in:
   - Name: `AI Learning Curve`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: `Web` → `https://your-domain.com/api/auth/microsoft/callback`
5. Click **Register**

### 2. Configure Authentication

1. In your app registration, go to **Authentication**
2. Add redirect URIs:
   - Development: `http://localhost:3000/api/auth/microsoft/callback`
   - Production: `https://your-domain.com/api/auth/microsoft/callback`
3. Under **Implicit grant and hybrid flows**, enable **ID tokens**
4. Save changes

### 3. Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: `AI Learning Curve Secret`
4. Choose expiration: **24 months** (or as needed)
5. Click **Add**
6. **Copy the secret value immediately** (you won't be able to see it again)

### 4. Get Application ID

1. Go to **Overview**
2. Copy the **Application (client) ID**

### 5. Add Environment Variables

```env
MICROSOFT_CLIENT_ID=your_microsoft_application_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

---

## Facebook Login Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** as app type
4. Fill in:
   - App name: `AI Learning Curve`
   - App contact email: Your email
5. Click **Create App**

### 2. Add Facebook Login Product

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter your site URL: `https://your-domain.com`

### 3. Configure OAuth Redirect URIs

1. Go to **Facebook Login** → **Settings**
2. Add **Valid OAuth Redirect URIs**:
   - Development: `http://localhost:3000/api/auth/facebook/callback`
   - Production: `https://your-domain.com/api/auth/facebook/callback`
3. Save changes

### 4. Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**

### 5. Make App Live

1. In the top bar, toggle the app from **Development** to **Live** mode
2. Complete any required verification steps

### 6. Add Environment Variables

```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

---

## Vercel Deployment

### Add Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all six variables:
   ```
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   MICROSOFT_CLIENT_ID
   MICROSOFT_CLIENT_SECRET
   FACEBOOK_APP_ID
   FACEBOOK_APP_SECRET
   BASE_URL (your production URL, e.g., https://your-domain.vercel.app)
   ```

3. Make sure to add them for **Production**, **Preview**, and **Development** environments

### Update Redirect URIs

After deploying to Vercel, update the redirect URIs in each provider:

- Google: Add `https://your-vercel-domain.vercel.app/api/auth/google/callback`
- Microsoft: Add `https://your-vercel-domain.vercel.app/api/auth/microsoft/callback`
- Facebook: Add `https://your-vercel-domain.vercel.app/api/auth/facebook/callback`

---

## Testing

### Local Testing

1. Add environment variables to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   MICROSOFT_CLIENT_ID=...
   MICROSOFT_CLIENT_SECRET=...
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Navigate to `/login` or `/register`
4. Click on the social login buttons to test

### Production Testing

1. Deploy to Vercel with environment variables configured
2. Test each social login provider
3. Verify that:
   - Users can sign in with social accounts
   - Email addresses are captured correctly
   - Accounts are created automatically
   - Users are redirected to dashboard after login

---

## Troubleshooting

### "Redirect URI mismatch" Error

- Ensure the redirect URI in your OAuth provider settings exactly matches your application URL
- Check for trailing slashes
- Verify http vs https

### "App not verified" Warning (Google)

- This is normal for apps in development
- Click "Advanced" → "Go to AI Learning Curve (unsafe)" during testing
- For production, submit your app for verification

### "This app is in development mode" (Facebook)

- Add test users in Facebook App Dashboard → Roles → Test Users
- Or make the app live in Settings → Basic → App Mode

### Session/Cookie Issues

- Ensure `JWT_SECRET` environment variable is set
- Check that cookies are enabled in the browser
- Verify `BASE_URL` is set correctly for production

---

## Security Notes

1. **Never commit secrets** to version control
2. **Rotate secrets regularly** (every 6-12 months)
3. **Use different credentials** for development and production
4. **Monitor OAuth usage** in each provider's dashboard
5. **Implement rate limiting** (already configured in the application)

---

## Optional: Disable Providers

If you don't want to use all three providers, simply don't set the environment variables for the providers you want to disable. The application will automatically skip configuration for missing credentials.

For example, to only use Google:
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Leave Microsoft and Facebook variables unset

The social login buttons will still appear, but clicking them will fail gracefully.
