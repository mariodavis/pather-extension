export const DRIVE_ROOT_ID = "root";
export const DRIVE_ROOT_PATH = "My Drive";

export const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
export const DRIVE_PAGE_SIZE = 1000;

export const DRIVE_FILE_FIELDS =
  "id,name,mimeType,parents,size,modifiedTime,webViewLink,iconLink";
export const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export const DB_NAME = "pather-drive-db";
export const DB_VERSION = 1;
export const NODES_STORE = "nodes";

// A service worker slice is stopped well before Chrome's ~30s idle kill
// so an in-flight fetch always has time to finish and persist state.
export const SCAN_TIME_BUDGET_MS = 20_000;
export const SCAN_RESUME_ALARM = "pather-scan-resume";

export const SCAN_STATUS = {
  IDLE: "idle",
  SCANNING: "scanning",
  PAUSED: "paused",
  COMPLETED: "completed",
  ERROR: "error",
};

export const NODE_KIND = {
  FILE: "file",
  FOLDER: "folder",
};

export const EXPORT_FORMAT = {
  CSV: "csv",
  JSON: "json",
  TXT: "txt",
};
