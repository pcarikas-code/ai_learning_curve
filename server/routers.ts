import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { certificateRouter } from "./certificateRouter";

export const appRouter = router({
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
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          status: input.status,
          progressPercent: input.progressPercent,
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
    submit: protectedProcedure
      .input(z.object({
        quizId: z.number(),
        answers: z.string(),
        score: z.number(),
        passed: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveQuizAttempt({
          userId: ctx.user.id,
          quizId: input.quizId,
          answers: input.answers,
          score: input.score,
          passed: input.passed,
        });
        return { success: true };
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
});

export type AppRouter = typeof appRouter;
