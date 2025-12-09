import { describe, it, expect } from 'vitest';
import { MicrosoftOAuthService } from './_core/microsoftOAuth';

describe('Microsoft OAuth Integration', () => {
  it('should have valid Microsoft OAuth credentials configured', () => {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const tenantId = process.env.MICROSOFT_TENANT_ID;

    expect(clientId).toBeDefined();
    expect(clientId).not.toBe('');
    expect(clientSecret).toBeDefined();
    expect(clientSecret).not.toBe('');
    expect(tenantId).toBeDefined();
    expect(tenantId).not.toBe('');
  });

  it('should generate valid Microsoft authorization URL', () => {
    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
    const tenantId = process.env.MICROSOFT_TENANT_ID!;
    const redirectUri = 'https://theailearningcurve.com/api/oauth/callback';

    const microsoftOAuth = new MicrosoftOAuthService(clientId, clientSecret, tenantId, redirectUri);
    const authUrl = microsoftOAuth.getAuthorizationUrl('test-state-123');

    expect(authUrl).toContain('login.microsoftonline.com');
    expect(authUrl).toContain(tenantId);
    expect(authUrl).toContain('oauth2/v2.0/authorize');
    expect(authUrl).toContain(`client_id=${clientId}`);
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain(encodeURIComponent(redirectUri));
    expect(authUrl).toContain('state=test-state-123');
    expect(authUrl).toContain('scope=openid+profile+email+User.Read');
  });

  it('should have correct tenant ID format (UUID)', () => {
    const tenantId = process.env.MICROSOFT_TENANT_ID!;
    
    // Tenant ID should be a UUID or 'common'/'organizations'/'consumers'
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validTenantFormats = ['common', 'organizations', 'consumers'];
    
    const isValidFormat = uuidRegex.test(tenantId) || validTenantFormats.includes(tenantId);
    expect(isValidFormat).toBe(true);
  });
});
