import { describe, it, expect } from 'vitest';
import { ENV } from './_core/env';

describe('Password Reset Configuration', () => {
  it('should have APP_URL configured', () => {
    expect(ENV.appUrl).toBeDefined();
    expect(ENV.appUrl).not.toBe('');
    expect(ENV.appUrl).not.toBe('http://localhost:3000');
    
    // Should be a valid URL
    expect(() => new URL(ENV.appUrl)).not.toThrow();
    
    const url = new URL(ENV.appUrl);
    expect(url.protocol).toMatch(/^https?:$/);
    
    console.log('✓ APP_URL is configured:', ENV.appUrl);
  });
  
  it('should generate valid password reset URL', () => {
    const resetToken = 'test-token-123';
    const resetUrl = `${ENV.appUrl}/reset-password?token=${resetToken}`;
    
    expect(resetUrl).toContain(ENV.appUrl);
    expect(resetUrl).toContain('/reset-password');
    expect(resetUrl).toContain('token=test-token-123');
    
    // Should be a valid URL
    expect(() => new URL(resetUrl)).not.toThrow();
    
    console.log('✓ Generated reset URL:', resetUrl);
  });
});
