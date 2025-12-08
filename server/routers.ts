import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { certificateRouter } from "./certificateRouter";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users, achievements } from "../drizzle/schema";
import { getDb } from "./db";
import * as achievementService from "./achievementService";

export const appRouter = router({
  user: router({
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
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
