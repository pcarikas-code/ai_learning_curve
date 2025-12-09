import nodemailer from 'nodemailer';

// Create email transporter
// For production, use a real email service like SendGrid, AWS SES, or SMTP
const createTransporter = () => {
  // For development/testing, use ethereal.email (fake SMTP service)
  // In production, replace with real SMTP credentials
  const testAccount = {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'testpassword',
  };

  const port = parseInt(process.env.SMTP_PORT || '587');
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: port,
    secure: port === 465, // true for 465 (SSL), false for 587 (TLS/STARTTLS)
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    // AWS SES requires explicit TLS configuration
    requireTLS: true,
  });
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  // Skip email sending if SMTP is not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured, skipping email to:', options.to);
    console.log('[Email] Subject:', options.subject);
    // Return true to not block the flow, but email won't actually be sent
    return true;
  }

  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"AI Learning Curve" <noreply@ailearningcurve.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('[Email] Message sent: %s', info.messageId);
    // Preview URL for ethereal.email (development only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Email] Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, baseUrl: string): Promise<boolean> {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>We received a request to reset your password for your AI Learning Curve account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The AI Learning Curve Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset Request
    
    Hi there,
    
    We received a request to reset your password for your AI Learning Curve account.
    
    Click this link to reset your password: ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, you can safely ignore this email.
    
    Best regards,
    The AI Learning Curve Team
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - AI Learning Curve',
    html,
    text,
  });
}

export async function sendEmailVerificationEmail(email: string, verificationToken: string, baseUrl: string): Promise<boolean> {
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AI Learning Curve!</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>Thank you for signing up for AI Learning Curve! We're excited to have you on board.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>Once verified, you'll have full access to all our AI learning resources and features.</p>
          <p>Best regards,<br>The AI Learning Curve Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to AI Learning Curve!
    
    Hi there,
    
    Thank you for signing up for AI Learning Curve! We're excited to have you on board.
    
    Please verify your email address by clicking this link: ${verificationUrl}
    
    This link will expire in 24 hours.
    
    Once verified, you'll have full access to all our AI learning resources and features.
    
    Best regards,
    The AI Learning Curve Team
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - AI Learning Curve',
    html,
    text,
  });
}
