// This is a "Web application" OAuth client (NOT "Chrome Extension" type),
// with this exact redirect URI added under Authorized redirect URIs:
//   chrome.identity.getRedirectURL() -> https://<extension-id>.chromiumapp.org/
// See README.md "Setup" for the full walkthrough.
export const OAUTH_CLIENT_ID = "419073309200-tm1d2vtumubjajf984jrs7vbic18rpt9.apps.googleusercontent.com";

export const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];
