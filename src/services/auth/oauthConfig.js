// This is a "Web application" OAuth client (NOT "Chrome Extension" type),
// with this exact redirect URI added under Authorized redirect URIs:
//   chrome.identity.getRedirectURL() -> https://<extension-id>.chromiumapp.org/
// See README.md "Setup" for the full walkthrough.
export const OAUTH_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";

export const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];
