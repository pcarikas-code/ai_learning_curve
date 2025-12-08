# Manus Hosting Deployment Guide

## Overview

Your AI Learning Curve platform is now configured for Manus hosting. This guide will walk you through the deployment process.

## What's Configured

✅ **Email/Password Authentication** - Users can register and login with email
✅ **Database** - Configured to use Manus built-in MySQL database
✅ **All Features** - Learning paths, modules, quizzes, achievements, enrollment system
✅ **Vercel Files Removed** - No more serverless function complexity

## Pre-Deployment Checklist

Before publishing, you need to:

### 1. Run Database Migrations

The Manus database needs the schema created. Run this command:

```bash
pnpm db:push
```

This will create all 15 tables in the Manus database:
- users
- learning_paths
- modules
- quizzes
- quiz_questions
- quiz_attempts
- user_progress
- achievements
- user_achievements
- certificates
- module_notes
- bookmarks
- resources
- path_enrollments
- reset_tokens (for password resets)

### 2. Seed Initial Data

After migrations, seed the database with learning content:

```bash
# Seed achievements (18 badges)
pnpm tsx server/seedAchievements.ts

# Seed learning paths and initial modules
pnpm tsx server/seedLearningPaths.ts

# Seed additional modules and quizzes
pnpm tsx server/seedMoreModules.ts
```

This will populate:
- 5 learning paths
- 22+ modules with content
- Quizzes with questions for each module
- 18 achievement badges

## Deployment Steps

### Step 1: Save a Checkpoint

Before publishing, create a checkpoint in Manus:

1. The checkpoint will be created automatically
2. This allows you to rollback if needed

### Step 2: Publish to Manus

1. **Click the "Publish" button** in the Manus Management UI (top-right corner)
2. Wait for the build and deployment process (usually 2-3 minutes)
3. Your site will be live at your Manus domain

### Step 3: Configure Custom Domain (Optional)

If you want a custom domain:

1. Go to **Settings → Domains** in the Management UI
2. Either:
   - Modify the auto-generated domain prefix (xxx.manus.space)
   - Purchase a new domain directly in Manus
   - Bind your existing custom domain

## Post-Deployment Testing

After deployment, test these critical flows:

### 1. Registration & Login
- Visit `/register` and create a test account
- Verify email (if SMTP is configured)
- Login at `/login`

### 2. Learning Paths
- Go to `/paths`
- Verify all 5 learning paths display
- Click on "AI Fundamentals"
- Check that modules are listed

### 3. Enrollment
- Click "Enroll in this Path" on any path
- Go to `/dashboard`
- Verify "My Learning" section shows enrolled path
- Check progress bar displays

### 4. Module Access
- Click on a module from an enrolled path
- Verify module content loads
- Check that quiz button appears

### 5. Achievements
- Go to `/achievements`
- Verify achievement badges display
- Complete actions to unlock achievements

## Environment Variables

Manus automatically provides these environment variables:

- `DATABASE_URL` - MySQL connection string (built-in database)
- `JWT_SECRET` - For session tokens
- `VITE_APP_TITLE` - "AI Learning Curve"
- `VITE_APP_LOGO` - Your logo path

### Optional: Email Configuration

To enable password reset and email verification emails, add these in **Settings → Secrets**:

- `SMTP_HOST` - Your email server (e.g., smtp.gmail.com)
- `SMTP_PORT` - Usually 587
- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your email password or app password
- `SMTP_FROM` - From address (e.g., "AI Learning Curve <noreply@yourdomain.com>")

**Note:** The app works without SMTP - emails just won't be sent, but registration and login still function.

## Database Management

### Viewing Data

Use the **Database** panel in Management UI to:
- Browse all tables
- View user accounts
- Check learning progress
- Manage enrollments
- View quiz attempts

### Backup & Recovery

Manus automatically backs up your database. To restore:
1. Go to a previous checkpoint
2. Click "Rollback" button
3. Your database and code will revert to that state

## Monitoring & Analytics

### Built-in Analytics

Go to **Dashboard** panel in Management UI to see:
- Page views (UV/PV)
- User activity
- Popular learning paths

### Application Logs

Check logs in the Management UI if you encounter issues:
1. Open the Management UI
2. Check the console output
3. Look for error messages

## Troubleshooting

### Issue: "Database not available"

**Solution:** Run database migrations
```bash
pnpm db:push
```

### Issue: "No learning paths found"

**Solution:** Seed the database
```bash
pnpm tsx server/seedLearningPaths.ts
pnpm tsx server/seedMoreModules.ts
```

### Issue: "Registration fails"

**Possible causes:**
1. Database not migrated - run `pnpm db:push`
2. JWT_SECRET not set - Manus provides this automatically
3. Check browser console for specific error

### Issue: "Modules not loading"

**Solution:**
1. Check Database panel - verify modules exist
2. Check that path_id matches learning path IDs
3. Re-run seed scripts if needed

## Rollback Procedure

If something goes wrong after deployment:

1. Go to Management UI
2. Find the previous checkpoint (before publish)
3. Click "Rollback" button
4. Your app will revert to the previous working state

## Performance Optimization

Your app is already optimized for production:
- Static assets are cached
- Database queries are indexed
- Images are optimized
- Code is minified

## Security Considerations

✅ **Passwords** - Hashed with bcrypt (10 rounds)
✅ **Sessions** - JWT tokens with 7-day expiry
✅ **Database** - Manus handles SSL/TLS automatically
✅ **Rate Limiting** - Applied to auth endpoints
✅ **CORS** - Configured for your domain

## Next Steps After Deployment

1. **Test thoroughly** - Go through all user flows
2. **Create test accounts** - Verify registration works
3. **Enroll in paths** - Test the learning experience
4. **Monitor usage** - Check analytics dashboard
5. **Gather feedback** - Share with beta users
6. **Add content** - Create modules for NLP and Computer Vision paths

## Support

If you encounter issues:
1. Check the Management UI logs
2. Review this deployment guide
3. Test locally first with `pnpm dev`
4. Create a checkpoint before making changes

## Summary

Your AI Learning Curve platform is ready for production on Manus hosting! The setup is much simpler than Vercel:

- ✅ No serverless complexity
- ✅ Built-in database included
- ✅ One-click deployment
- ✅ Automatic backups
- ✅ Custom domain support
- ✅ Everything works out of the box

Just run migrations, seed data, and click Publish!
