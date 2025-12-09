import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { getDb } from "./db";
import { users, userProgress, pathEnrollments, userAchievements, quizAttempts } from "../drizzle/schema";
import { eq, like, or, desc } from "drizzle-orm";

// Admin-only procedure that checks if user has admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // List all users with optional search and pagination
  listUsers: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const offset = (input.page - 1) * input.limit;

      let query = db.select().from(users);

      // Apply search filter if provided
      if (input.search) {
        query = query.where(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`)
          )
        ) as any;
      }

      const allUsers = await query
        .orderBy(desc(users.createdAt))
        .limit(input.limit)
        .offset(offset);

      // Get total count for pagination
      const totalUsers = await db.select().from(users);

      return {
        users: allUsers,
        total: totalUsers.length,
        page: input.page,
        totalPages: Math.ceil(totalUsers.length / input.limit),
      };
    }),

  // Get single user details
  getUser: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const userResult = await db.select().from(users).where(eq(users.id, input.userId));

      if (userResult.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return userResult[0];
    }),

  // Update user details
  updateUser: adminProcedure
    .input(z.object({
      userId: z.number(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(['user', 'admin']).optional(),
      emailVerified: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const { userId, ...updates } = input;

      await db.update(users)
        .set(updates)
        .where(eq(users.id, userId));

      return { success: true, message: 'User updated successfully' };
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true, message: 'User deleted successfully' };
    }),

  // Get user activity history
  getUserActivity: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Get user progress
      const progress = await db.select().from(userProgress).where(eq(userProgress.userId, input.userId));

      // Get path enrollments
      const enrollments = await db.select().from(pathEnrollments).where(eq(pathEnrollments.userId, input.userId));

      // Get achievements
      const achievements = await db.select().from(userAchievements).where(eq(userAchievements.userId, input.userId));

      // Get quiz attempts
      const quizzes = await db.select().from(quizAttempts).where(eq(quizAttempts.userId, input.userId));

      return {
        progress,
        enrollments,
        achievements,
        quizzes,
      };
    }),

  // Get admin statistics
  getStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const allUsers = await db.select().from(users);
      const totalUsers = allUsers.length;
      const verifiedUsers = allUsers.filter(u => u.emailVerified === 1).length;
      const adminUsers = allUsers.filter(u => u.role === 'admin').length;

      // Get recent users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUsers = allUsers.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

      return {
        totalUsers,
        verifiedUsers,
        adminUsers,
        recentUsers,
      };
    }),
});
