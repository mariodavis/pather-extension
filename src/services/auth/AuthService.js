/**
 * Wraps chrome.identity so the rest of the app only ever deals with a
 * plain access token, never with the extension's OAuth plumbing.
 */
export class AuthService {
  async isConnected() {
    try {
      const token = await this.getToken(false);
      return Boolean(token);
    } catch {
      return false;
    }
  }

  async connect() {
    return this.getToken(true);
  }

  async disconnect() {
    const token = await this.getToken(false).catch(() => null);
    if (!token) return;

    await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, { method: "POST" });
    await new Promise((resolve) => chrome.identity.removeCachedAuthToken({ token }, resolve));
  }

  getToken(interactive = true) {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError || !token) {
          reject(new Error(chrome.runtime.lastError?.message ?? "No Google account authorized."));
          return;
        }
        resolve(typeof token === "string" ? token : token.token ?? "");
      });
    });
  }
}

export const authService = new AuthService();
