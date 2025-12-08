import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// @ts-ignore - No types available for passport-microsoft
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export function configureSocialAuth(baseUrl: string) {
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${baseUrl}/api/auth/google/callback`,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const database = await getDb();
            if (!database) {
              return done(new Error('Database not available'));
            }

            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email found in Google profile'));
            }

            // Check if user exists
            const existingUsers = await database.select().from(users).where(eq(users.email, email));

            if (existingUsers.length > 0) {
              // Update existing user
              const user = existingUsers[0];
              await database.update(users)
                .set({
                  name: profile.displayName || user.name,
                  loginMethod: 'google',
                  emailVerified: 1, // Google emails are pre-verified
                  lastSignedIn: new Date(),
                })
                .where(eq(users.id, user.id));

              return done(null, { ...user, emailVerified: 1 });
            } else {
              // Create new user
              const result = await database.insert(users).values({
                name: profile.displayName || 'Google User',
                email,
                loginMethod: 'google',
                role: 'user',
                emailVerified: 1, // Google emails are pre-verified
                openId: `google_${profile.id}`,
              });

              const newUserResult = await database.select().from(users).where(eq(users.email, email));
              return done(null, newUserResult[0]);
            }
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Microsoft OAuth Strategy
  if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(
      new MicrosoftStrategy(
        {
          clientID: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          callbackURL: `${baseUrl}/api/auth/microsoft/callback`,
          scope: ['user.read'],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const database = await getDb();
            if (!database) {
              return done(new Error('Database not available'));
            }

            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email found in Microsoft profile'));
            }

            // Check if user exists
            const existingUsers = await database.select().from(users).where(eq(users.email, email));

            if (existingUsers.length > 0) {
              // Update existing user
              const user = existingUsers[0];
              await database.update(users)
                .set({
                  name: profile.displayName || user.name,
                  loginMethod: 'microsoft',
                  emailVerified: 1, // Microsoft emails are pre-verified
                  lastSignedIn: new Date(),
                })
                .where(eq(users.id, user.id));

              return done(null, { ...user, emailVerified: 1 });
            } else {
              // Create new user
              await database.insert(users).values({
                name: profile.displayName || 'Microsoft User',
                email,
                loginMethod: 'microsoft',
                role: 'user',
                emailVerified: 1, // Microsoft emails are pre-verified
                openId: `microsoft_${profile.id}`,
              });

              const newUserResult = await database.select().from(users).where(eq(users.email, email));
              return done(null, newUserResult[0]);
            }
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${baseUrl}/api/auth/facebook/callback`,
          profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const database = await getDb();
            if (!database) {
              return done(new Error('Database not available'));
            }

            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email found in Facebook profile'));
            }

            // Check if user exists
            const existingUsers = await database.select().from(users).where(eq(users.email, email));

            if (existingUsers.length > 0) {
              // Update existing user
              const user = existingUsers[0];
              await database.update(users)
                .set({
                  name: profile.displayName || user.name,
                  loginMethod: 'facebook',
                  emailVerified: 1, // Facebook emails are pre-verified
                  lastSignedIn: new Date(),
                })
                .where(eq(users.id, user.id));

              return done(null, { ...user, emailVerified: 1 });
            } else {
              // Create new user
              await database.insert(users).values({
                name: profile.displayName || 'Facebook User',
                email,
                loginMethod: 'facebook',
                role: 'user',
                emailVerified: 1, // Facebook emails are pre-verified
                openId: `facebook_${profile.id}`,
              });

              const newUserResult = await database.select().from(users).where(eq(users.email, email));
              return done(null, newUserResult[0]);
            }
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const database = await getDb();
      if (!database) {
        return done(new Error('Database not available'));
      }

      const userResult = await database.select().from(users).where(eq(users.id, id));
      if (userResult.length > 0) {
        done(null, userResult[0]);
      } else {
        done(new Error('User not found'));
      }
    } catch (error) {
      done(error);
    }
  });
}
