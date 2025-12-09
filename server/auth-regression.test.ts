import { describe, it, expect, beforeAll } from 'vitest';
import { ENV } from './_core/env';

describe('Authentication Regression Tests', () => {
  describe('JWT Module Loading', () => {
    it('should load jsonwebtoken module correctly', async () => {
      // Test that we can load JWT without dynamic import issues
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const jwt = require('jsonwebtoken');
      
      expect(jwt).toBeDefined();
      expect(jwt.sign).toBeDefined();
      expect(jwt.verify).toBeDefined();
      expect(typeof jwt.sign).toBe('function');
      expect(typeof jwt.verify).toBe('function');
      
      console.log('✓ JWT module loaded correctly with createRequire');
    });
    
    it('should sign and verify JWT tokens', async () => {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const jwt = require('jsonwebtoken');
      
      const payload = { userId: 1, email: 'test@example.com' };
      const secret = 'test-secret';
      
      // Sign token
      const token = jwt.sign(payload, secret, { expiresIn: '7d' });
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token
      const decoded = jwt.verify(token, secret) as any;
      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@example.com');
      
      console.log('✓ JWT sign and verify working correctly');
    });
  });
  
  describe('Environment Configuration', () => {
    it('should have JWT_SECRET configured', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.JWT_SECRET).not.toBe('');
      console.log('✓ JWT_SECRET is configured');
    });
    
    it('should have APP_URL configured for password reset', () => {
      expect(ENV.appUrl).toBeDefined();
      expect(ENV.appUrl).not.toBe('');
      expect(() => new URL(ENV.appUrl)).not.toThrow();
      console.log('✓ APP_URL is configured:', ENV.appUrl);
    });
    
    it('should have SMTP configured for emails', () => {
      expect(process.env.SMTP_HOST).toBeDefined();
      expect(process.env.SMTP_PORT).toBeDefined();
      expect(process.env.SMTP_USER).toBeDefined();
      expect(process.env.SMTP_PASS).toBeDefined();
      expect(process.env.SMTP_FROM).toBeDefined();
      console.log('✓ SMTP configuration present');
    });
  });
  
  describe('Password Reset URL Generation', () => {
    it('should generate valid password reset URLs', () => {
      const resetToken = 'test-token-abc123';
      const resetUrl = `${ENV.appUrl}/reset-password?token=${resetToken}`;
      
      expect(resetUrl).toContain(ENV.appUrl);
      expect(resetUrl).toContain('/reset-password');
      expect(resetUrl).toContain(`token=${resetToken}`);
      
      // Should be a valid URL
      const url = new URL(resetUrl);
      expect(url.protocol).toMatch(/^https?:$/);
      expect(url.pathname).toBe('/reset-password');
      expect(url.searchParams.get('token')).toBe(resetToken);
      
      console.log('✓ Password reset URL format correct:', resetUrl);
    });
  });
  
  describe('Database Schema', () => {
    it('should have users table with auth fields', async () => {
      const db = await import('./db');
      const database = await db.getDb();
      
      expect(database).toBeDefined();
      
      // Check that we can query users table
      const result = await database.query.users.findMany({ limit: 1 });
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✓ Users table accessible');
    });
    
    it('should have path_enrollments table', async () => {
      const db = await import('./db');
      const database = await db.getDb();
      
      expect(database).toBeDefined();
      
      // Check that we can query path_enrollments table
      const result = await database.query.pathEnrollments.findMany({ limit: 1 });
      expect(Array.isArray(result)).toBe(true);
      
      console.log('✓ path_enrollments table accessible');
    });
  });
});
