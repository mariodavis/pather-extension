# Pather — Google Drive Mapper (Chrome Extension)

Maps, searches and exports the metadata of a Google Drive account: folder
tree, full-text-by-name search with filters, and CSV/JSON/TXT export.
Read-only — it never modifies or downloads file contents, only metadata
(name, size, parent, links, timestamps).

## Architecture

Plain JavaScript, no TypeScript. Layered so each piece has one job and
depends only on abstractions it needs (SOLID), with no duplicated logic
(DRY) or hardcoded/mock data anywhere — every Drive record comes from a
live `files.list` call.

```
src/
  background/index.js       composition root + message router (MV3 service worker)
  services/
    auth/AuthService.js      chrome.identity OAuth wrapper
    drive/DriveApiClient.js  paginated Google Drive API v3 client
    scan/ScanService.js      resumable BFS crawler over the folder tree
    storage/DriveRepository.js + db.js   IndexedDB persistence
    export/ExportService.js + formatters/  CSV / JSON / TXT
    messaging/               typed-by-convention message contracts (popup <-> background)
  popup/
    App.jsx, main.jsx        React shell + router
    components/              Home, Scan, Tree, Search, Exports views
    hooks/                   thin bridges from components to the message bus
  shared/                    constants.js, driveNode.js (single record shape)
```

Each service takes its dependencies through its constructor (e.g.
`new ScanService(driveApiClient, driveRepository)`), so any of them can be
swapped or unit-tested in isolation without touching the others.

### Why a BFS crawler instead of one big `files.list`

The Drive API returns a flat list per query; there's no native "give me
the whole tree" call. `ScanService` walks folders breadth-first,
persisting its queue and progress to `chrome.storage.local` after every
folder. MV3 service workers can be killed mid-scan, so a `chrome.alarms`
tick resumes an interrupted scan exactly where it left off — a scan of a
large Drive survives the worker being unloaded.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create an OAuth client ID** (required before this will authenticate):
   - Go to the [Google Cloud Console](https://console.cloud.google.com/) → create/select a project.
   - Enable the **Google Drive API** (APIs & Services → Library).
   - APIs & Services → Credentials → **Create Credentials → OAuth client ID**.
   - Application type: **Chrome Extension**.
   - You'll need your extension's ID first — build once, load it unpacked
     (step 4), copy the ID Chrome assigns it, then come back and create the
     OAuth client using that ID.
   - Copy the generated Client ID into `manifest.config.js`, replacing
     `YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com`.

3. **Build**
   ```bash
   npm run build
   ```
   Output goes to `dist/`.

4. **Load into Chrome**
   - `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `dist/`.

5. Rebuild (`npm run build`) after changing the OAuth client ID, then reload the extension.

## Notes

- Scopes requested: `drive.metadata.readonly` and `drive.readonly` — read-only, no write/delete permission is ever requested.
- All scanned metadata is stored locally in the browser's IndexedDB; nothing is sent anywhere except direct calls to `googleapis.com`.
- "Copy link" uses the `webViewLink` Google already provides per file — no link is invented.
