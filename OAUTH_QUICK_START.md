# OAuth Quick Start Guide

This guide will help you quickly set up Google, Microsoft, and Facebook OAuth for the AI Learning Curve platform.

## Prerequisites

- A deployed instance of AI Learning Curve (on Vercel or other hosting)
- Access to Google Cloud Console, Azure Portal, and Facebook Developers
- Your production URL (e.g., `https://your-domain.vercel.app`)

---

## Google OAuth (5 minutes)

### 1. Create Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Click "Select a project" → "New Project"
- Name: `AI Learning Curve` → Create

### 2. Configure OAuth Consent
- Navigate to **APIs & Services** → **OAuth consent screen**
- Select **External** → Create
- Fill in:
  - App name: `AI Learning Curve`
  - User support email: Your email
  - Developer contact: Your email
- Click **Save and Continue** (skip scopes and test users)

### 3. Create Credentials
- Go to **Credentials** → **Create Credentials** → **OAuth client ID**
- Application type: **Web application**
- Name: `AI Learning Curve Web`
- **Authorized redirect URIs**: Add your callback URL
  ```
  https://your-domain.vercel.app/api/auth/google/callback
  ```
- Click **Create**
- **Copy the Client ID and Client Secret**

### 4. Add to Vercel
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## Microsoft OAuth (7 minutes)

### 1. Register Application
- Go to [Azure Portal](https://portal.azure.com/)
- Navigate to **Azure Active Directory** → **App registrations** → **New registration**
- Name: `AI Learning Curve`
- Supported account types: **Personal Microsoft accounts only**
- Redirect URI: `Web` → `https://your-domain.vercel.app/api/auth/microsoft/callback`
- Click **Register**

### 2. Create Client Secret
- In your app, go to **Certificates & secrets** → **New client secret**
- Description: `AI Learning Curve Secret`
- Expires: **24 months**
- Click **Add** → **Copy the secret value immediately**

### 3. Get Application ID
- Go to **Overview** → Copy the **Application (client) ID**

### 4. Add to Vercel
```env
MICROSOFT_CLIENT_ID=your_application_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_here
```

---

## Facebook Login (6 minutes)

### 1. Create App
- Go to [Facebook Developers](https://developers.facebook.com/)
- Click **My Apps** → **Create App**
- Use case: **Authenticate and request data from users with Facebook Login**
- App name: `AI Learning Curve`
- App contact email: Your email
- Click **Create App**

### 2. Add Facebook Login
- In your app dashboard, click **Add Product**
- Find **Facebook Login** → **Set Up**
- Choose **Web** platform
- Site URL: `https://your-domain.vercel.app`
- Click **Save** → **Continue**

### 3. Configure Settings
- Go to **Facebook Login** → **Settings**
- **Valid OAuth Redirect URIs**: Add
  ```
  https://your-domain.vercel.app/api/auth/facebook/callback
  ```
- Click **Save Changes**

### 4. Get Credentials
- Go to **Settings** → **Basic**
- Copy **App ID** and **App Secret**

### 5. Make App Live
- Toggle app from **Development** to **Live** mode (top bar)
- Complete any required verification

### 6. Add to Vercel
```env
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
```

---

## Final Steps

### 1. Add BASE_URL to Vercel
```env
BASE_URL=https://your-domain.vercel.app
```

### 2. Deploy
- Push your code to GitHub
- Vercel will automatically redeploy
- Test each social login on your live site

### 3. Test Each Provider
1. Go to `/login` or `/register`
2. Click each social login button
3. Complete the OAuth flow
4. Verify you're redirected to the dashboard

---

## Troubleshooting

### "Redirect URI mismatch"
- Ensure the callback URL in your OAuth provider settings exactly matches your deployed URL
- Check for trailing slashes
- Verify `https://` (not `http://`)

### "App not verified" (Google)
- Click "Advanced" → "Go to AI Learning Curve (unsafe)"
- This is normal for development/testing
- For production, submit your app for Google verification

### "App is in development mode" (Facebook)
- Add test users in **Roles** → **Test Users**
- Or switch app to Live mode in **Settings** → **Basic**

### Social login buttons don't work
- Check browser console for errors
- Verify all 6 environment variables are set in Vercel
- Ensure `BASE_URL` is set correctly
- Check that the dev server restarted after adding env vars

---

## Security Checklist

- ✅ All secrets added to Vercel (not in code)
- ✅ Callback URLs use `https://` in production
- ✅ App secrets are different for dev/production
- ✅ OAuth apps are set to "Live" mode for production use
- ✅ Rate limiting is enabled (already configured in the app)

---

## Optional: Disable Providers

If you only want to use some providers (e.g., just Google), simply don't set the environment variables for the providers you want to disable. The app will gracefully skip configuration for missing credentials.

For example, to only use Google and Microsoft:
```env
# Set these
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# Leave these unset
# FACEBOOK_APP_ID=...
# FACEBOOK_APP_SECRET=...
```

The Facebook button will still appear but clicking it will fail gracefully.

---

## Need Help?

- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Microsoft OAuth**: https://docs.microsoft.com/en-us/azure/active-directory/develop/
- **Facebook Login**: https://developers.facebook.com/docs/facebook-login/

For detailed step-by-step instructions with screenshots, see `SOCIAL_LOGIN_SETUP.md`.
