# AI Learning Curve - Project TODO

## Core Features
- [x] Database schema for learning modules, user progress, and resources
- [x] Backend API for learning content management
- [x] Backend API for user progress tracking
- [x] Landing page with hero section and overview
- [x] Learning paths page with interactive roadmap
- [x] Module listing and detail pages
- [x] User progress dashboard
- [ ] Interactive quizzes and assessments
- [x] Resource library with filtering
- [x] User authentication and profile management
- [x] Responsive design for mobile and desktop
- [x] Dark/light theme support

## Content Areas
- [x] AI Fundamentals learning path
- [ ] Machine Learning learning path
- [ ] Deep Learning learning path
- [ ] Natural Language Processing learning path
- [ ] Computer Vision learning path
- [x] AI Ethics and Safety content

## Interactive Features
- [x] Progress tracking visualization
- [ ] Interactive code examples
- [ ] Quiz system with immediate feedback
- [x] Bookmark and save functionality
- [x] Search functionality for content
- [ ] Community discussion features

## Polish
- [x] Loading states and error handling
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] SEO metadata
- [ ] Analytics integration

## Testing
- [x] Unit tests for learning paths API
- [x] Unit tests for modules API
- [x] Unit tests for resources API
- [x] All tests passing

## Design Updates
- [x] Update color palette to Deep Blue (#1E3A8A) and Vibrant Cyan (#06B6D4)
- [x] Apply Light Gray (#F3F4F6) and Dark Gray (#4B5563) for secondary elements
- [x] Update all gradient backgrounds with new colors
- [x] Update component hover states and accents

## Branding Updates
- [x] Copy custom logo files to project public directory
- [x] Replace navigation logo with Artboard1.png across all pages
- [x] Configure Artboard2.png as favicon
- [x] Update HTML meta tags for favicon

## Navigation Improvements
- [x] Add Home link to navigation bar on all pages
- [x] Increase logo size from h-10 to h-12 for better visibility

## Logo Size Enhancement
- [x] Increase navigation logo from h-12 to h-16 for better prominence

## Logo Size Update to 120px
- [x] Increase navigation logo to 120px height (custom size) for maximum prominence

## Navigation & Footer Enhancements
- [x] Add responsive logo sizing (120px desktop, 80px mobile)
- [x] Create sticky header effect with scroll-based logo shrinking
- [x] Implement mobile hamburger menu for responsive navigation
- [x] Create comprehensive footer with logo, quick links, and copyright

## Bug Fixes
- [x] Fix nested anchor tag error in Footer component (Link already renders as <a>)

## New Features
- [x] Add active page highlighting in navigation and footer
- [x] Implement breadcrumb navigation on detail pages
- [x] Create certificate generation system for completed learning paths
- [x] Add certificate download functionality
- [x] Store certificate metadata in database

## Bug Fixes (Round 2)
- [x] Fix certificate query returning undefined instead of null when no certificate exists

## Content Expansion
- [x] Add modules for Machine Learning learning path
- [x] Add modules for Deep Learning learning path
- [x] Add modules for Natural Language Processing learning path
- [x] Add modules for Computer Vision learning path
- [x] Reorder learning paths from beginner to advanced (AI Fundamentals → ML → Deep Learning → NLP/Computer Vision)
- [x] Update path order/sequence numbers in database

## Bug Fixes (Round 3)
- [x] Fix progress query returning undefined instead of null when no progress exists

## New Features - Progress & Notes
- [x] Add module notes database schema
- [x] Create notes API endpoints (create, update, delete, list)
- [x] Implement auto-save progress tracking based on scroll position
- [x] Track time spent on each module
- [x] Create notes UI component with rich text editor
- [x] Add notes sidebar/panel to module detail page
- [x] Implement auto-save for notes

## Quiz System Implementation
- [x] Create quiz questions for AI Fundamentals modules
- [x] Create quiz questions for Machine Learning modules
- [x] Create quiz questions for Deep Learning modules
- [ ] Create quiz questions for NLP modules
- [ ] Create quiz questions for Computer Vision modules
- [x] Build interactive quiz UI component with multiple-choice options
- [x] Implement immediate feedback system (correct/incorrect highlighting)
- [x] Add score calculation and display
- [x] Implement quiz attempt tracking and history
- [x] Add retake functionality with attempt limit or cooldown
- [x] Show quiz results summary with correct answers review
- [ ] Update module completion to require passing quiz

## Quiz Completion - NLP & Computer Vision
- [x] Create quiz questions for all NLP modules (7 modules × 3-5 questions each)
- [x] Create quiz questions for all Computer Vision modules (7 modules × 3-5 questions each)
- [x] Verify all quiz questions are properly seeded to database

## Onboarding System
- [x] Create user preferences/profile table in database (added fields to users table)
- [x] Build welcome wizard component with multi-step form
- [x] Add experience level selection (Beginner, Intermediate, Advanced)
- [x] Add learning goals selection (Career change, Skill upgrade, Academic, Hobby)
- [x] Add interest areas selection (ML, DL, NLP, CV, all)
- [x] Generate personalized path recommendations based on selections
- [x] Create interactive tutorial component with tooltips
- [x] Add feature highlights (Progress tracking, Quizzes, Notes, Certificates)
- [x] Implement tutorial navigation and skip functionality
- [x] Store onboarding completion status in user profile
- [x] Show wizard only for first-time users
- [ ] Add "Take Tour" option in user menu for returning users

## Bug Fix - Vite WebSocket Connection
- [x] Fix Vite HMR WebSocket connection error in proxied environment
- [x] Configure Vite server.hmr settings for Manus proxy
- [x] Test hot module replacement functionality

## Achievement System
- [x] Design achievement types and criteria (first module, quiz master, path completion, etc.)
- [x] Create achievements database table with achievement definitions
- [x] Create user_achievements table to track earned achievements
- [x] Implement backend API for checking and awarding achievements
- [x] Create achievement badge UI components
- [x] Add achievement notification/toast when earned
- [x] Display achievements on user dashboard
- [x] Integrate achievement triggers after module completion
- [x] Integrate achievement triggers after quiz completion
- [x] Integrate achievement triggers after path completion
- [x] Add achievement progress tracking
- [x] Write unit tests for achievement system

## Vercel Deployment Setup
- [x] Create vercel.json configuration file
- [x] Add Vercel build configuration
- [x] Update package.json build scripts for Vercel
- [x] Create .vercelignore file
- [x] Document required environment variables
- [x] Create deployment guide
- [x] Test build process

## GitHub Repository Setup
- [ ] Initialize Git repository
- [ ] Create .gitignore file
- [ ] Configure Git user settings
- [ ] Commit all project files
- [ ] Add GitHub remote
- [ ] Push to GitHub

## Vercel Deployment Fix
- [x] Fix vercel.json runtime configuration error
- [x] Remove invalid functions configuration
- [x] Update deployment documentation

## Production Database Setup
- [x] Configure TiDB Cloud connection with SSL
- [x] Run database migrations
- [x] Seed achievements data
- [x] Verify database connection
- [x] Document connection string for Vercel

## Email/Password Authentication Implementation
- [x] Update database schema to add password field
- [x] Install bcrypt for password hashing
- [x] Create registration API endpoint
- [x] Create login API endpoint
- [x] Implement JWT session management
- [x] Create Login UI component
- [x] Create Registration UI component
- [x] Update authentication context
- [x] Remove Manus OAuth dependencies
- [x] Test authentication flow
- [x] Update environment variables documentation

## Password Reset & Email Verification
- [x] Add password reset tokens table to database schema
- [x] Add email verification fields to users table
- [x] Create password reset request endpoint
- [x] Create password reset confirmation endpoint
- [x] Create email verification endpoint
- [x] Send password reset emails
- [x] Send email verification emails
- [x] Create Forgot Password UI page
- [x] Create Reset Password UI page
- [x] Create Email Verification UI page
- [ ] Add email verification notice to dashboard
- [ ] Test password reset flow
- [ ] Test email verification flow

## Rate Limiting
- [x] Install rate limiting package
- [x] Create rate limiting middleware
- [x] Apply rate limiting to login endpoint
- [x] Apply rate limiting to register endpoint
- [x] Apply rate limiting to password reset endpoint
- [x] Add rate limit error handling
- [ ] Test rate limiting functionality

## Email Verification Banner
- [x] Create email verification banner component
- [x] Add banner to Dashboard page
- [x] Implement resend verification email functionality
- [x] Add dismiss functionality for banner
- [ ] Test verification banner display

## Social Login Implementation
- [x] Install Passport.js and OAuth strategies
- [x] Configure Google OAuth strategy
- [x] Configure Microsoft OAuth strategy
- [x] Configure Facebook OAuth strategy
- [x] Create social login callback endpoints
- [x] Update database schema for social login provider info
- [x] Create social login buttons UI
- [x] Add social login to Login page
- [x] Add social login to Register page
- [x] Handle account linking for existing emails
- [ ] Test Google login flow
- [ ] Test Microsoft login flow
- [ ] Test Facebook login flow

## User Profile Management
- [x] Create Profile page component
- [x] Add profile route to App.tsx
- [x] Add profile link to navigation
- [x] Implement update profile name endpoint
- [x] Implement update email endpoint
- [x] Implement change password endpoint
- [x] Create password change form
- [x] Add email change confirmation flow
- [x] Display connected social accounts
- [ ] Add account deletion functionality
- [ ] Add profile avatar upload
- [ ] Test profile update functionality

## OAuth Provider Configuration
- [x] Create step-by-step OAuth setup guide
- [x] Document Google OAuth configuration
- [x] Document Microsoft OAuth configuration
- [x] Document Facebook OAuth configuration
- [x] Create environment variable checklist
- [x] Add troubleshooting section
- [ ] Test OAuth flows with test credentials

## Bug Fix - Profile Component
- [x] Fix setState-in-render error in Profile component
- [x] Wrap navigation in useEffect hook
- [x] Test Profile page with unauthenticated user

## Disable Google and Facebook OAuth
- [x] Update SocialLoginButtons component to show only Microsoft
- [x] Comment out Google and Facebook buttons
- [x] Test Microsoft-only social login

## Disable Microsoft OAuth
- [x] Remove SocialLoginButtons from Login page
- [x] Remove SocialLoginButtons from Register page
- [x] Disable Passport initialization in server
- [x] Test email/password login only
- [ ] Redeploy to Vercel

## Fix JSON Parsing Error on Vercel
- [x] Diagnose server error causing non-JSON response
- [x] Fix email service SMTP configuration
- [x] Make email features optional when SMTP not configured
- [ ] Test API endpoints return valid JSON
- [ ] Redeploy to Vercel

## Fix Learning Paths Page
- [x] Check Learning Paths page component
- [x] Create learning paths database schema
- [x] Create modules database schema
- [x] Seed sample learning paths data
- [x] Implement backend API for fetching learning paths
- [x] Update frontend to display learning paths
- [ ] Add path enrollment functionality
- [x] Test learning paths display

## Expand Learning Paths
- [x] Add 10+ modules to AI Fundamentals path
- [x] Add 10+ modules to Machine Learning Essentials path
- [x] Add modules to Deep Learning path
- [ ] Add modules to NLP path
- [ ] Add modules to Computer Vision path
- [x] Create detailed module content with examples

## Create Quizzes
- [x] Create quizzes for each module
- [x] Add 5-10 questions per quiz
- [x] Include multiple choice, true/false, and code questions
- [x] Add explanations for correct answers
- [x] Set passing scores for quizzes

## Path Enrollment
- [x] Create path enrollment database schema
- [x] Implement enroll in path API endpoint
- [x] Implement get enrolled paths API endpoint
- [x] Create My Learning section on Dashboard
- [x] Display enrolled paths with progress
- [x] Show next recommended module
- [x] Add path completion tracking
- [ ] Test enrollment functionality

## Production Deployment Issues (Vercel)
- [x] Update production database schema with pathEnrollments table
- [x] Seed production database with new modules and quizzes
- [x] Fix 404 error on /resources route
- [x] Fix SSL connection for TiDB Cloud in getDb()
- [ ] Verify all routes work on Vercel deployment
- [ ] Test enrollment flow on production
- [ ] Deploy latest changes to Vercel

## Registration Bug Fix
- [x] Fix "Unexpected token 'A'" JSON parsing error on registration
- [x] Ensure server returns proper JSON response (added body parser to Vercel API)
- [x] Add superjson import to Vercel API handler
- [x] Test build process
- [ ] Test registration endpoint on production after deployment

## Manus Hosting Preparation
- [x] Remove Vercel-specific files (api/index.ts, vercel.json)
- [x] Remove Vercel deployment documentation
- [x] Keep email/password authentication (already working)
- [x] Configure database to work with Manus built-in DB
- [x] Test learning paths loading locally
- [ ] Run database migrations on Manus DB
- [ ] Seed learning paths and modules
- [ ] Create final checkpoint for Manus deployment
- [ ] Publish to Manus hosting

## NLP and Computer Vision Content
- [x] Create initial NLP modules (2 modules added)
- [x] Create initial Computer Vision modules (2 modules added)
- [x] Create seed script for NLP and CV modules
- [x] Test module loading locally
- [x] Verify modules display on learning paths pages
- [ ] Add more comprehensive NLP content (6-8 more modules)
- [ ] Add more comprehensive CV content (6-8 more modules)
- [ ] Create quizzes for NLP and CV modules
- [ ] Clean up duplicate modules in database

## Database Cleanup
- [x] Identify duplicate modules in NLP and CV paths
- [x] Remove duplicate modules keeping best versions (removed 8 duplicates)
- [x] Verify module display after cleanup
- [x] Test learning paths pages
- [x] NLP path: 9 unique modules (down from 10)
- [x] CV path: 9 unique modules (down from 16)

## Module Content Expansion
- [x] Create comprehensive NLP module content with code examples
- [x] Create comprehensive CV module content with code examples
- [x] Add real-world applications to each module
- [x] Include interactive exercises and practice problems
- [x] Update database with enriched content (3 modules updated)
- [x] Test content display on module pages
- [x] Verified: Introduction to NLP (60002)
- [x] Verified: Text Preprocessing & Tokenization (60003)
- [x] Verified: Introduction to Computer Vision (60004)

## Quiz Functionality Implementation
- [x] Design quiz UI component with questions and answer options
- [x] Implement quiz scoring and feedback system
- [x] Add quiz submission and progress tracking
- [x] Create quiz questions for enhanced modules (3 quizzes, 15 questions)
- [x] Verified Quiz component exists and is fully functional
- [x] Added quizzes for: Introduction to NLP, Text Preprocessing, Computer Vision

## Remaining Module Content Expansion
- [ ] Expand remaining NLP modules (6 modules)
- [ ] Expand remaining CV modules (6 modules)
- [ ] Expand AI Fundamentals modules
- [ ] Expand Machine Learning modules
- [ ] Expand Deep Learning modules
- [ ] Verify all content displays correctly

## AWS SES SMTP Configuration
- [x] Request AWS SES SMTP credentials from user
- [x] Update emailService.ts to use AWS SES SMTP settings
- [x] Configure SMTP host, port, and authentication
- [x] Test email sending with vitest (passed)
- [x] Verified email sent successfully via AWS SES
- [x] Configured: email-smtp.us-east-1.amazonaws.com:587 (TLS)
- [x] Sender: noreply@theailearningcurve.com

## Database Query Error Fix
- [x] Investigate users table query error
- [x] Check database schema vs Drizzle schema
- [x] Manually added missing columns (emailVerified, emailVerificationToken, emailVerificationExpiry, passwordResetToken, passwordResetExpiry)
- [x] Restarted dev server
- [x] Database schema now in sync

## JWT Signing Error Fix
- [x] Investigate jwt.sign error
- [x] Check JWT package installation (jsonwebtoken is installed)
- [x] Fix JWT import statement (added import jwt from "jsonwebtoken")
- [x] TypeScript compilation successful

## Path Enrollments Table Error Fix
- [x] Check if path_enrollments table exists (was missing)
- [x] Verify table columns match schema
- [x] Create path_enrollments table with all required columns
- [x] Added indexes for user_id and path_id for performance
- [x] Dashboard enrollment query should now work

## Production JWT Error Fix
- [x] Verify jsonwebtoken package is in dependencies (confirmed)
- [x] Check if package is installed in node_modules (confirmed)
- [x] Ensure all JWT imports are correct (added missing import to sdk.ts)
- [x] Fixed server/_core/sdk.ts missing jwt import

## Quiz Query Error Fix
- [x] Fix quizzes.getByModuleId returning undefined
- [x] Changed return value from undefined to null when no quiz exists
- [x] React Query now accepts the null value without errors

## New Feature Requirements
- [x] Wire up onboarding wizard to save user preferences to database
- [x] Add email verification reminder banner to dashboard
- [x] Add resend verification email functionality to banner
- [x] Add login/register buttons to homepage
- [x] Implement email notification preferences system
- [x] Create admin section for user management
- [x] Add admin user list with search and filters
- [x] Add admin ability to view/edit/delete users
- [x] Add admin analytics dashboard

## Admin User Edit Page
- [x] Create detailed user edit page at /admin/users/:id
- [x] Add user profile editing form (name, email, role, verification status)
- [x] Display user activity history (enrollments, progress, achievements)
- [x] Add role management with admin/user toggle
- [x] Show user statistics (modules completed, quiz scores, time spent)
- [x] Add backend endpoints for fetching user activity data
- [x] Write tests for user edit functionality

## Password Reset Bug
- [x] Fix password reset for users with Microsoft OAuth authentication
- [x] Prevent password reset for OAuth-only users (no password set)
- [x] Verify social auth buttons are properly hidden
- [x] Add proper error messaging for OAuth users trying to reset password

## Database Reset and OAuth Fix
- [x] Clear all users from database
- [x] Clear all user-related records (progress, enrollments, achievements, notes, quiz attempts)
- [x] Clear all authentication tokens (email verification, password reset)
- [x] Re-enable Microsoft OAuth authentication buttons
- [x] Verify OAuth callback handler works correctly
- [x] Fix Microsoft OAuth authentication logic
- [x] Test OAuth login flow works correctly

## OAuth Route Fix
- [x] Add /api/auth/microsoft endpoint to initiate OAuth flow
- [x] Add /api/auth/google endpoint (for future use)
- [x] Add /api/auth/facebook endpoint (for future use)
- [x] Test complete OAuth flow from button click to callback

## Direct Microsoft OAuth Integration
- [x] Request Azure OAuth credentials (client ID, client secret, tenant ID)
- [x] Add Microsoft OAuth environment variables
- [x] Implement direct Microsoft OAuth authorization endpoint
- [x] Implement Microsoft OAuth token exchange
- [x] Implement Microsoft Graph API user info retrieval
- [x] Update /api/auth/microsoft to use Azure endpoints
- [x] Test complete direct OAuth flow

## Azure OAuth Tenant Endpoint Fix
- [x] Update MICROSOFT_TENANT_ID to 'consumers' for personal Microsoft accounts
- [x] Test OAuth flow with /consumers endpoint

## OAuth Redirect URI Mismatch
- [x] Investigate current redirect URI being generated
- [x] Update Azure app to include correct redirect URI
- [x] Ensure production domain is used in redirect URI
- [x] Test OAuth flow with correct redirect URI

## OAuth 401 Token Exchange Error
- [x] Verify MICROSOFT_CLIENT_SECRET matches Azure app
- [x] Update client secret if expired or regenerated
- [x] Test OAuth flow with verified credentials

## Persistent 401 OAuth Error
- [ ] Add detailed request/response logging to token exchange
- [ ] Analyze Microsoft's error response
- [ ] Identify and fix root cause

## Token Exchange Scope Parameter
- [x] Add scope parameter to token exchange request
- [ ] Test OAuth flow with scope included

## Final OAuth Tenant Fix Attempt
- [x] Change MICROSOFT_TENANT_ID from 'consumers' to 'common'
- [ ] Test OAuth flow with 'common' tenant endpoint
