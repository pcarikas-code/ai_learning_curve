import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { users, userProgress, pathEnrollments, userAchievements } from '../drizzle/schema';

describe('Admin User Edit and Activity', () => {
  let adminUserId: number;
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create an admin user
    const adminResult = await db.insert(users).values({
      name: 'Test Admin Edit',
      email: `test-admin-edit-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'admin',
      emailVerified: 1,
    });
    adminUserId = Number(adminResult[0].insertId);

    // Create a test user with activity
    const userResult = await db.insert(users).values({
      name: 'Test User Activity',
      email: `test-user-activity-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'user',
      emailVerified: 0,
    });
    testUserId = Number(userResult[0].insertId);

    // Add some activity data
    await db.insert(userProgress).values({
      userId: testUserId,
      moduleId: 1,
      status: 'completed',
      progressPercent: 100,
    });

    await db.insert(pathEnrollments).values({
      userId: testUserId,
      pathId: 1,
      progressPercent: 50,
    });
  });

  it('should fetch user activity history', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const activity = await caller.admin.getUserActivity({
      userId: testUserId,
    });

    expect(activity).toBeDefined();
    expect(activity.progress).toBeDefined();
    expect(activity.enrollments).toBeDefined();
    expect(activity.achievements).toBeDefined();
    expect(activity.quizzes).toBeDefined();
    expect(Array.isArray(activity.progress)).toBe(true);
    expect(Array.isArray(activity.enrollments)).toBe(true);
  });

  it('should show user has completed modules', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const activity = await caller.admin.getUserActivity({
      userId: testUserId,
    });

    const completedModules = activity.progress.filter(p => p.status === 'completed');
    expect(completedModules.length).toBeGreaterThan(0);
  });

  it('should show user has path enrollments', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const activity = await caller.admin.getUserActivity({
      userId: testUserId,
    });

    expect(activity.enrollments.length).toBeGreaterThan(0);
    expect(activity.enrollments[0].userId).toBe(testUserId);
  });

  it('should allow admin to update user role', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const result = await caller.admin.updateUser({
      userId: testUserId,
      role: 'admin',
    });

    expect(result.success).toBe(true);

    // Verify the update
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    const updatedUser = await db.select().from(users).where((t) => t.id === testUserId);
    expect(updatedUser[0].role).toBe('admin');
  });

  it('should deny non-admin access to user activity', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: testUserId,
        role: 'user',
      } as any,
    });

    await expect(
      caller.admin.getUserActivity({ userId: testUserId })
    ).rejects.toThrow('Admin access required');
  });
});
