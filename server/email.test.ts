import { describe, it, expect } from 'vitest';
import { sendEmail } from './emailService';

describe('AWS SES SMTP Configuration', () => {
  it('should successfully send a test email via AWS SES', async () => {
    // Skip test if SMTP is not configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP not configured, skipping email test');
      return;
    }

    const testEmail = process.env.SMTP_FROM?.match(/<(.+)>/)?.[1] || process.env.SMTP_USER || 'test@example.com';
    
    const result = await sendEmail({
      to: testEmail, // Send to the same verified address for testing
      subject: 'AWS SES SMTP Test - AI Learning Curve',
      html: `
        <h1>AWS SES SMTP Configuration Test</h1>
        <p>This is a test email to verify that AWS SES SMTP is configured correctly.</p>
        <p>If you receive this email, your SMTP configuration is working!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: `AWS SES SMTP Configuration Test\n\nThis is a test email to verify that AWS SES SMTP is configured correctly.\n\nIf you receive this email, your SMTP configuration is working!\n\nTimestamp: ${new Date().toISOString()}`,
    });

    expect(result).toBe(true);
    console.log('✓ Test email sent successfully via AWS SES');
    console.log(`  Recipient: ${testEmail}`);
    console.log('  Check your inbox to confirm delivery');
  }, 30000); // 30 second timeout for email sending
});
