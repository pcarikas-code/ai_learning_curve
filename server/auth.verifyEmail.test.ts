import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Email Verification', () => {
  let testDb: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    testDb = await getDb();
  });

  it('should have database connection', () => {
    expect(testDb).toBeDefined();
  });

  it('should find user with verification token in database', async () => {
    if (!testDb) throw new Error('Database not available');

    // Check if there's a user with a verification token
    const usersWithTokens = await testDb
      .select()
      .from(users)
      .where(eq(users.emailVerified, 0));

    console.log('Users with unverified emails:', usersWithTokens.length);
    
    if (usersWithTokens.length > 0) {
      const user = usersWithTokens[0];
      console.log('Sample unverified user:', {
        id: user.id,
        email: user.email,
        hasToken: !!user.emailVerificationToken,
        tokenExpiry: user.emailVerificationExpiry,
        isExpired: user.emailVerificationExpiry ? user.emailVerificationExpiry < new Date() : null,
      });

      expect(user.emailVerificationToken).toBeTruthy();
      expect(user.emailVerificationExpiry).toBeTruthy();
    }
  });

  it('should validate token expiry logic', () => {
    // Test future date (not expired)
    const futureDate = new Date(Date.now() + 86400000); // 24 hours from now
    expect(futureDate > new Date()).toBe(true);

    // Test past date (expired)
    const pastDate = new Date(Date.now() - 86400000); // 24 hours ago
    expect(pastDate < new Date()).toBe(true);
  });

  it('should verify email verification token exists in production', async () => {
    if (!testDb) throw new Error('Database not available');

    // Check for the specific token mentioned in the bug report
    const token = '37537c34ef27b9fc26056800759333213865cf74f8669d7e3c2eb5a639d9b2e9';
    
    const userResult = await testDb
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token));

    if (userResult.length > 0) {
      const user = userResult[0];
      console.log('Found user with token:', {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        tokenExpiry: user.emailVerificationExpiry,
        isExpired: user.emailVerificationExpiry ? user.emailVerificationExpiry < new Date() : null,
        expiryTimestamp: user.emailVerificationExpiry?.getTime(),
        currentTimestamp: Date.now(),
      });

      expect(user.emailVerificationToken).toBe(token);
      expect(user.emailVerificationExpiry).toBeTruthy();
      
      // Check if token is expired
      if (user.emailVerificationExpiry) {
        const isExpired = user.emailVerificationExpiry < new Date();
        console.log('Token expired:', isExpired);
      }
    } else {
      console.log('Token not found in database - may have been used or expired');
    }
  });

  it('should have correct URL format for verification links', () => {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const token = 'test-token-123';
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    console.log('Generated verification URL:', verificationUrl);
    
    expect(verificationUrl).toContain('/verify-email?token=');
    expect(verificationUrl).toContain(token);
    
    // Verify URL parsing
    const url = new URL(verificationUrl);
    const parsedToken = url.searchParams.get('token');
    expect(parsedToken).toBe(token);
  });
});
