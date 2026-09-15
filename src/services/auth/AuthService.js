import { OAUTH_CLIENT_ID, OAUTH_SCOPES } from "./oauthConfig";

const TOKEN_STORAGE_KEY = "pather.authToken";
const EXPIRY_SAFETY_MARGIN_MS = 60_000;

function buildAuthUrl(interactive) {
  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    response_type: "token",
    redirect_uri: chrome.identity.getRedirectURL(),
    scope: OAUTH_SCOPES.join(" "),
    // Silent renewals (interactive:false) have no window to show a consent
    // screen in — prompt=consent there would fail every single call.
    // prompt=none instead tells Google to renew off the existing browser
    // session with no UI, or fail fast if that's not possible.
    prompt: interactive ? "consent" : "none",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function parseTokenFromRedirect(redirectUrl) {
  const fragment = new URLSearchParams(new URL(redirectUrl).hash.slice(1));
  const accessToken = fragment.get("access_token");
  if (!accessToken) throw new Error(fragment.get("error") ?? "Authorization did not return a token.");
  const expiresIn = Number(fragment.get("expires_in") ?? 0);
  return { accessToken, expiresAt: Date.now() + expiresIn * 1000 };
}

/**
 * Uses launchWebAuthFlow (a real HTTPS redirect) instead of getAuthToken,
 * so this works the same way in Chrome and in Chromium forks like Brave
 * whose native identity flow Google's custom-URI-scheme restriction breaks.
 */
export class AuthService {
  async isConnected() {
    try {
      return Boolean(await this.getToken(false));
    } catch {
      return false;
    }
  }

  async connect() {
    return this.getToken(true);
  }

  async disconnect() {
    const cached = await this.loadCachedToken();
    await chrome.storage.local.remove(TOKEN_STORAGE_KEY);
    if (cached?.accessToken) {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${cached.accessToken}`, { method: "POST" });
    }
  }

  async getToken(interactive = true) {
    const cached = await this.loadCachedToken();
    if (cached && cached.expiresAt > Date.now() + EXPIRY_SAFETY_MARGIN_MS) {
      return cached.accessToken;
    }

    const redirectUrl = await new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({ url: buildAuthUrl(interactive), interactive }, (result) => {
        if (chrome.runtime.lastError || !result) {
          reject(new Error(chrome.runtime.lastError?.message ?? "Authorization was not completed."));
          return;
        }
        resolve(result);
      });
    });

    const token = parseTokenFromRedirect(redirectUrl);
    await chrome.storage.local.set({ [TOKEN_STORAGE_KEY]: token });
    return token.accessToken;
  }

  async loadCachedToken() {
    const result = await chrome.storage.local.get(TOKEN_STORAGE_KEY);
    return result[TOKEN_STORAGE_KEY] ?? null;
  }
}

export const authService = new AuthService();
