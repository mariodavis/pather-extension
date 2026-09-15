import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

// OAuth client_id must be created per-installation in Google Cloud Console
// (APIs & Services > Credentials > OAuth client ID > Chrome Extension).
// See README.md "Setup" for the exact steps. Never commit a real client_id.
const OAUTH_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";

export default defineManifest({
  manifest_version: 3,
  name: "Pather — Map. Search. Understand.",
  version: pkg.version,
  description:
    "Scans your Google Drive metadata to build a searchable folder map, with tree view, filtered search and CSV/JSON/TXT exports.",
  icons: {
    16: "public/icons/icon16.png",
    48: "public/icons/icon48.png",
    128: "public/icons/icon128.png",
  },
  action: {
    default_popup: "index.html",
    default_icon: {
      16: "public/icons/icon16.png",
      48: "public/icons/icon48.png",
      128: "public/icons/icon128.png",
    },
  },
  background: {
    service_worker: "src/background/index.js",
    type: "module",
  },
  permissions: ["identity", "storage", "alarms", "downloads"],
  host_permissions: ["https://www.googleapis.com/*"],
  oauth2: {
    client_id: OAUTH_CLIENT_ID,
    scopes: [
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  },
  minimum_chrome_version: "116",
});
