export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate Manus OAuth login URL
export const getLoginUrl = () => {
  const appId = import.meta.env.VITE_APP_ID;
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  
  return `${oauthPortalUrl}?app_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
};
