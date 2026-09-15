import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

// The real OAuth client_id lives in src/services/auth/oauthConfig.js, not
// here — this build now authenticates via launchWebAuthFlow, which reads
// the client_id at runtime rather than through the manifest's oauth2 key.

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
  host_permissions: ["https://www.googleapis.com/*", "https://accounts.google.com/*"],
  minimum_chrome_version: "116",
});
