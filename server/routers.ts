import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { certificateRouter } from "./certificateRouter";
import { adminRouter } from "./adminRouter";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users, achievements } from "../drizzle/schema";
import { getDb } from "./db";
import * as achievementService from "./achievementService";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

export const appRouter = router({
  admin: adminRouter,
  user: router({
    updateNotificationPreferences: protectedProcedure
      .input(z.object({
        emailNotifications: z.number(),
        notifyOnModuleComplete: z.number(),
        notifyOnQuizResult: z.number(),
        notifyOnPathComplete: z.number(),
        notifyOnNewContent: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        await db.update(users)
          .set({
            emailNotifications: input.emailNotifications,
            notifyOnModuleComplete: input.notifyOnModuleComplete,
            notifyOnQuizResult: input.notifyOnQuizResult,
            notifyOnPathComplete: input.notifyOnPathComplete,
            notifyOnNewContent: input.notifyOnNewContent,
          })
          .where(eq(users.id, ctx.user.id));
        
        return { success: true, message: 'Notification preferences updated successfully' };
      }),
    updateOnboarding: protectedProcedure
      .input(z.object({
        experienceLevel: z.string(),
        learningGoals: z.string(),
        interests: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        await db.update(users)
          .set({
            experienceLevel: input.experienceLevel,
            learningGoals: input.learningGoals,
            interests: input.interests,
            onboardingCompleted: 1,
          })
          .where(eq(users.id, ctx.user.id));
        
        return { success: true };
      }),
  }),
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    register: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import('bcryptjs');
        const jwt = await import('jsonwebtoken');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Check if user already exists
        const existingUser = await database.select().from(users).where(eq(users.email, input.email));
        if (existingUser.length > 0) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        
        // Generate email verification token
        const crypto = await import('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 86400000); // 24 hours from now
        
        // Create user
        const result = await database.insert(users).values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          loginMethod: 'email',
          role: 'user',
          emailVerified: 0,
          emailVerificationToken: verificationToken,
          emailVerificationExpiry: verificationExpiry,
        });
        
        // Get the created user
        const userResult = await database.select().from(users).where(eq(users.email, input.email));
        const userId = userResult[0].id;
        
        // Send verification email
        const { sendEmailVerificationEmail } = await import('./emailService');
        const baseUrl = `${ctx.req.protocol}://${ctx.req.get('host')}`;
        await sendEmailVerificationEmail(input.email, verificationToken, baseUrl);
        
        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
        const token = jwt.sign({ userId, email: input.email }, jwtSecret, { expiresIn: '7d' });
        
        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        
        return { success: true, userId, message: 'Registration successful. Please check your email to verify your account.' };
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import('bcryptjs');
        const jwt = await import('jsonwebtoken');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Find user
        const userResult = await database.select().from(users).where(eq(users.email, input.email));
        if (userResult.length === 0) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
        }
        
        const user = userResult[0];
        
        // Verify password
        if (!user.password) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
        }
        
        const isValidPassword = await bcrypt.compare(input.password, user.password);
        if (!isValidPassword) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
        }
        
        // Update last signed in
        await database.update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user.id));
        
        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
        const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
        
        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        
        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
      }),
    requestPasswordReset: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ ctx, input }) => {
        const crypto = await import('crypto');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Find user
        const userResult = await database.select().from(users).where(eq(users.email, input.email));
        if (userResult.length === 0) {
          // Don't reveal if email exists or not (security best practice)
          return { success: true, message: 'If the email exists, a reset link has been sent' };
        }
        
        const user = userResult[0];
        
        // Check if user is OAuth-only (no password set)
        if (user.loginMethod && user.loginMethod !== 'email' && !user.password) {
          // Don't reveal authentication method (security best practice)
          return { success: true, message: 'If the email exists, a reset link has been sent' };
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        
        // Save token to database
        await database.update(users)
          .set({
            passwordResetToken: resetToken,
            passwordResetExpiry: resetExpiry,
          })
          .where(eq(users.id, user.id));
        
        // Send email
        const { sendPasswordResetEmail } = await import('./emailService');
        const baseUrl = `${ctx.req.protocol}://${ctx.req.get('host')}`;
        await sendPasswordResetEmail(user.email, resetToken, baseUrl);
        
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }),
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const bcrypt = await import('bcryptjs');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Find user with valid token
        const userResult = await database.select().from(users)
          .where(eq(users.passwordResetToken, input.token));
        
        if (userResult.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired reset token' });
        }
        
        const user = userResult[0];
        
        // Check if token is expired
        if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired reset token' });
        }
        
        // Check if user is OAuth-only (no password set)
        if (user.loginMethod && user.loginMethod !== 'email' && !user.password) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: `This account uses ${user.loginMethod} authentication. Please sign in with ${user.loginMethod} instead.` 
          });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        
        // Update password and clear reset token
        await database.update(users)
          .set({
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpiry: null,
          })
          .where(eq(users.id, user.id));
        
        return { success: true, message: 'Password reset successfully' };
      }),
    verifyEmail: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Find user with valid token
        const userResult = await database.select().from(users)
          .where(eq(users.emailVerificationToken, input.token));
        
        if (userResult.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired verification token' });
        }
        
        const user = userResult[0];
        
        // Check if token is expired
        if (!user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired verification token' });
        }
        
        // Mark email as verified and clear token
        await database.update(users)
          .set({
            emailVerified: 1,
            emailVerificationToken: null,
            emailVerificationExpiry: null,
          })
          .where(eq(users.id, user.id));
        
        return { success: true, message: 'Email verified successfully' };
      }),
    resendVerificationEmail: protectedProcedure
      .mutation(async ({ ctx }) => {
        const crypto = await import('crypto');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        const user = ctx.user;
        
        // Check if already verified
        if (user.emailVerified === 1) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email already verified' });
        }
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 86400000); // 24 hours from now
        
        // Save token to database
        await database.update(users)
          .set({
            emailVerificationToken: verificationToken,
            emailVerificationExpiry: verificationExpiry,
          })
          .where(eq(users.id, user.id));
        
        // Send email
        const { sendEmailVerificationEmail } = await import('./emailService');
        const baseUrl = `${ctx.req.protocol}://${ctx.req.get('host')}`;
        await sendEmailVerificationEmail(user.email, verificationToken, baseUrl);
        
        return { success: true, message: 'Verification email sent' };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.email && input.email !== ctx.user.email) {
          // Check if email already exists
          const existingUser = await database.select().from(users).where(eq(users.email, input.email));
          if (existingUser.length > 0 && existingUser[0].id !== ctx.user.id) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email already in use' });
          }
          updateData.email = input.email;
          updateData.emailVerified = 0; // Reset verification if email changed
        }
        
        if (Object.keys(updateData).length > 0) {
          await database.update(users)
            .set(updateData)
            .where(eq(users.id, ctx.user.id));
        }
        
        return { success: true, message: 'Profile updated successfully' };
      }),
    changePassword: protectedProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import('bcryptjs');
        const database = await getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        
        // Only allow password change for email/password accounts
        if (ctx.user.loginMethod !== 'email') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Password change not available for social login accounts' });
        }
        
        // Get user with password
        const userResult = await database.select().from(users).where(eq(users.id, ctx.user.id));
        if (userResult.length === 0) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        
        const user = userResult[0];
        if (!user.password) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'No password set for this account' });
        }
        
        // Verify current password
        const isValid = await bcrypt.compare(input.currentPassword, user.password);
        if (!isValid) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        
        // Update password
        await database.update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, ctx.user.id));
        
        return { success: true, message: 'Password changed successfully' };
      }),
  }),

  learningPaths: router({
    list: publicProcedure.query(async () => {
      return db.getAllLearningPaths();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getLearningPathBySlug(input.slug);
      }),
    enroll: protectedProcedure
      .input(z.object({ pathId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.enrollInPath(ctx.user.id, input.pathId);
      }),
    getEnrolled: protectedProcedure.query(async ({ ctx }) => {
      return db.getEnrolledPaths(ctx.user.id);
    }),
    getEnrollmentStatus: protectedProcedure
      .input(z.object({ pathId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getEnrollmentStatus(ctx.user.id, input.pathId);
      }),
  }),

  modules: router({
    getByPathId: publicProcedure
      .input(z.object({ pathId: z.number() }))
      .query(async ({ input }) => {
        return db.getModulesByPathId(input.pathId);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getModuleBySlug(input.slug);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getModuleById(input.id);
      }),
  }),

  progress: router({
    get: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const progress = await db.getUserProgress(ctx.user.id, input.moduleId);
        return progress || null;
      }),
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getAllUserProgress(ctx.user.id);
      }),
    update: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        status: z.enum(["not_started", "in_progress", "completed"]),
        progressPercent: z.number().min(0).max(100),
        timeSpentMinutes: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          status: input.status,
          progressPercent: input.progressPercent,
          timeSpentMinutes: input.timeSpentMinutes,
          lastAccessedAt: new Date(),
          completedAt: input.completedAt,
          startedAt: input.status !== "not_started" ? new Date() : undefined,
        });
        return { success: true };
      }),
  }),

  quizzes: router({
    getByModuleId: publicProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return db.getQuizByModuleId(input.moduleId);
      }),
    getQuestions: publicProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ input }) => {
        return db.getQuizQuestions(input.quizId);
      }),
    submitAttempt: protectedProcedure
      .input(z.object({
        quizId: z.number(),
        answers: z.array(z.object({
          questionId: z.number(),
          selectedAnswer: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const quiz = await db.getQuizById(input.quizId);
        if (!quiz) throw new Error("Quiz not found");

        const questions = await db.getQuizQuestions(input.quizId);
        
        // Calculate score
        let correctCount = 0;
        for (const answer of input.answers) {
          const question = questions.find(q => q.id === answer.questionId);
          if (question && question.correctAnswer === answer.selectedAnswer) {
            correctCount++;
          }
        }

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= quiz.passingScore;

        // Save attempt
        const attemptId = await db.saveQuizAttempt({
          userId: ctx.user.id,
          quizId: input.quizId,
          answers: JSON.stringify(input.answers),
          score,
          passed,
        });

        return {
          attemptId,
          score,
          passed,
          correctCount,
          totalQuestions: questions.length,
        };
      }),
    getAttempts: protectedProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserQuizAttempts(ctx.user.id, input.quizId);
      }),
  }),

  resources: router({
    list: publicProcedure.query(async () => {
      return db.getAllResources();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceById(input.id);
      }),
  }),

  certificates: certificateRouter,

  notes: router({
    list: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getModuleNotes(ctx.user.id, input.moduleId);
      }),
    create: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createModuleNote({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          content: input.content,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateModuleNote(input.id, input.content);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteModuleNote(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserBookmarks(ctx.user.id);
    }),
    add: protectedProcedure
      .input(z.object({
        itemType: z.enum(["module", "resource"]),
        itemId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addBookmark({
          userId: ctx.user.id,
          itemType: input.itemType,
          itemId: input.itemId,
        });
        return { success: true };
      }),
    remove: protectedProcedure
      .input(z.object({
        itemType: z.enum(["module", "resource"]),
        itemId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.removeBookmark(ctx.user.id, input.itemType, input.itemId);
        return { success: true };
      }),
    check: protectedProcedure
      .input(z.object({
        itemType: z.enum(["module", "resource"]),
        itemId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        return db.checkBookmark(ctx.user.id, input.itemType, input.itemId);
      }),
  }),

  achievements: router({
    // Get all achievements earned by the user
    getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
      return achievementService.getUserAchievements(ctx.user.id);
    }),

    // Get achievement progress stats
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      return achievementService.getAchievementProgress(ctx.user.id);
    }),

    // Check all achievements and award any newly earned
    checkAll: protectedProcedure.mutation(async ({ ctx }) => {
      const newAchievements = await achievementService.checkAllAchievements(ctx.user.id);
      return { newAchievements };
    }),

    // Check specific achievement
    check: protectedProcedure
      .input(z.object({ achievementKey: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return achievementService.checkAchievement(ctx.user.id, input.achievementKey);
      }),

    // Get all available achievements (for display)
    listAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(achievements).where(eq(achievements.isActive, true));
    }),
  }),
});

export type AppRouter = typeof appRouter;
