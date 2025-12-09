import axios from 'axios';

export interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
  id_token?: string;
}

export interface MicrosoftUserInfo {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  givenName?: string;
  surname?: string;
}

export class MicrosoftOAuthService {
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, tenantId: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenantId = tenantId;
    this.redirectUri = redirectUri;
  }

  /**
   * Generate the Microsoft OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      response_mode: 'query',
      scope: 'openid profile email User.Read',
      state,
    });

    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<MicrosoftTokenResponse> {
    const tokenEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    try {
      const response = await axios.post<MicrosoftTokenResponse>(
        tokenEndpoint,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[Microsoft OAuth] Token exchange failed:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Get user information from Microsoft Graph API
   */
  async getUserInfo(accessToken: string): Promise<MicrosoftUserInfo> {
    try {
      const response = await axios.get<MicrosoftUserInfo>(
        'https://graph.microsoft.com/v1.0/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[Microsoft OAuth] Get user info failed:', error.response?.data || error.message);
      throw new Error('Failed to get user information');
    }
  }
}
