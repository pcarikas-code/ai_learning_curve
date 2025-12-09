import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Admin User Management', () => {
  let adminUserId: number;
  let regularUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create an admin user
    const adminResult = await db.insert(users).values({
      name: 'Test Admin',
      email: `test-admin-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'admin',
      emailVerified: 1,
    });
    adminUserId = Number(adminResult[0].insertId);

    // Create a regular user
    const userResult = await db.insert(users).values({
      name: 'Test Regular User',
      email: `test-regular-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'user',
      emailVerified: 0,
    });
    regularUserId = Number(userResult[0].insertId);
  });

  it('should allow admin to list users', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const result = await caller.admin.listUsers({
      page: 1,
      limit: 20,
    });

    expect(result.users).toBeDefined();
    expect(Array.isArray(result.users)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  it('should allow admin to get user stats', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const stats = await caller.admin.getStats();

    expect(stats.totalUsers).toBeGreaterThan(0);
    expect(stats.verifiedUsers).toBeGreaterThanOrEqual(0);
    expect(stats.adminUsers).toBeGreaterThan(0);
    expect(stats.recentUsers).toBeGreaterThanOrEqual(0);
  });

  it('should allow admin to update user details', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const result = await caller.admin.updateUser({
      userId: regularUserId,
      emailVerified: 1,
    });

    expect(result.success).toBe(true);

    // Verify the update
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    const updatedUser = await db.select().from(users).where(eq(users.id, regularUserId));
    expect(updatedUser[0].emailVerified).toBe(1);
  });

  it('should deny non-admin users access to admin endpoints', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: regularUserId,
        role: 'user',
      } as any,
    });

    await expect(
      caller.admin.listUsers({ page: 1, limit: 20 })
    ).rejects.toThrow('Admin access required');
  });

  it('should allow admin to search users', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: adminUserId,
        role: 'admin',
      } as any,
    });

    const result = await caller.admin.listUsers({
      search: 'Test Regular',
      page: 1,
      limit: 20,
    });

    expect(result.users.length).toBeGreaterThan(0);
    expect(result.users.some(u => u.name.includes('Test Regular'))).toBe(true);
  });
});
