import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Password Reset for OAuth Users', () => {
  let oauthUserId: number;
  let emailUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create an OAuth user (Microsoft login, no password)
    const oauthResult = await db.insert(users).values({
      name: 'OAuth User Test',
      email: `oauth-test-${Date.now()}@example.com`,
      loginMethod: 'microsoft',
      openId: 'microsoft-oauth-id-123',
      password: null,
      emailVerified: 1,
    });
    oauthUserId = Number(oauthResult[0].insertId);

    // Create a regular email user with password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const emailResult = await db.insert(users).values({
      name: 'Email User Test',
      email: `email-test-${Date.now()}@example.com`,
      loginMethod: 'email',
      password: hashedPassword,
      emailVerified: 1,
    });
    emailUserId = Number(emailResult[0].insertId);
  });

  it('should not send password reset email to OAuth users', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const oauthUser = await db.select().from(users).where(eq(users.id, oauthUserId));
    const caller = appRouter.createCaller({
      user: null,
      req: {
        protocol: 'https',
        get: () => 'test.example.com',
      } as any,
      res: {} as any,
    });

    const result = await caller.auth.requestPasswordReset({
      email: oauthUser[0].email,
    });

    // Should return success message (for security, don't reveal if OAuth)
    expect(result.success).toBe(true);
    expect(result.message).toBe('If the email exists, a reset link has been sent');

    // But should NOT have created a reset token
    const userAfter = await db.select().from(users).where(eq(users.id, oauthUserId));
    expect(userAfter[0].passwordResetToken).toBeNull();
  });

  it('should send password reset email to regular email users', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const emailUser = await db.select().from(users).where(eq(users.id, emailUserId));
    const caller = appRouter.createCaller({
      user: null,
      req: {
        protocol: 'https',
        get: () => 'test.example.com',
      } as any,
      res: {} as any,
    });

    const result = await caller.auth.requestPasswordReset({
      email: emailUser[0].email,
    });

    expect(result.success).toBe(true);

    // Should have created a reset token
    const userAfter = await db.select().from(users).where(eq(users.id, emailUserId));
    expect(userAfter[0].passwordResetToken).not.toBeNull();
    expect(userAfter[0].passwordResetExpiry).not.toBeNull();
  });

  it('should reject password reset for OAuth users even with valid token', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Manually set a reset token for OAuth user (simulating if they somehow got one)
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 3600000);

    await db.update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      })
      .where(eq(users.id, oauthUserId));

    const caller = appRouter.createCaller({
      user: null,
    });

    // Try to reset password
    await expect(
      caller.auth.resetPassword({
        token: resetToken,
        newPassword: 'newpassword123',
      })
    ).rejects.toThrow('This account uses microsoft authentication');
  });

  it('should allow password reset for regular email users', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const emailUser = await db.select().from(users).where(eq(users.id, emailUserId));
    const resetToken = emailUser[0].passwordResetToken;

    if (!resetToken) {
      throw new Error('Reset token not found for email user');
    }

    const caller = appRouter.createCaller({
      user: null,
    });

    const result = await caller.auth.resetPassword({
      token: resetToken,
      newPassword: 'newpassword456',
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Password reset successfully');

    // Verify password was updated and token cleared
    const userAfter = await db.select().from(users).where(eq(users.id, emailUserId));
    expect(userAfter[0].passwordResetToken).toBeNull();
    expect(userAfter[0].passwordResetExpiry).toBeNull();
    expect(userAfter[0].password).not.toBe(emailUser[0].password);
  });
});
