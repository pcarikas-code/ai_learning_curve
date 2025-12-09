import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('User Notification Preferences', () => {
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create a test user
    const result = await db.insert(users).values({
      name: 'Test User Notifications',
      email: `test-notifications-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'user',
      emailVerified: 1,
      emailNotifications: 1,
      notifyOnModuleComplete: 1,
      notifyOnQuizResult: 1,
      notifyOnPathComplete: 1,
      notifyOnNewContent: 1,
    });

    testUserId = Number(result[0].insertId);
  });

  it('should update notification preferences successfully', async () => {
    const caller = appRouter.createCaller({
      user: {
        id: testUserId,
        openId: null,
        name: 'Test User Notifications',
        email: `test-notifications-${Date.now()}@example.com`,
        role: 'user',
        emailVerified: 1,
        emailNotifications: 1,
        notifyOnModuleComplete: 1,
        notifyOnQuizResult: 1,
        notifyOnPathComplete: 1,
        notifyOnNewContent: 1,
      } as any,
    });

    const result = await caller.user.updateNotificationPreferences({
      emailNotifications: 0,
      notifyOnModuleComplete: 0,
      notifyOnQuizResult: 1,
      notifyOnPathComplete: 1,
      notifyOnNewContent: 0,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Notification preferences updated successfully');

    // Verify the update in database
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const updatedUser = await db.select().from(users).where(eq(users.id, testUserId));
    expect(updatedUser[0].emailNotifications).toBe(0);
    expect(updatedUser[0].notifyOnModuleComplete).toBe(0);
    expect(updatedUser[0].notifyOnQuizResult).toBe(1);
    expect(updatedUser[0].notifyOnPathComplete).toBe(1);
    expect(updatedUser[0].notifyOnNewContent).toBe(0);
  });

  it('should require authentication', async () => {
    const caller = appRouter.createCaller({
      user: null,
    });

    await expect(
      caller.user.updateNotificationPreferences({
        emailNotifications: 0,
        notifyOnModuleComplete: 0,
        notifyOnQuizResult: 0,
        notifyOnPathComplete: 0,
        notifyOnNewContent: 0,
      })
    ).rejects.toThrow('Please login');
  });
});
