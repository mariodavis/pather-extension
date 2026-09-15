import { FOLDER_MIME_TYPE, NODE_KIND } from "./constants";

/**
 * @param {object} raw - Raw file resource from the Drive API.
 * @param {{ folderId: string, path: string }} parent
 */
export function createDriveNode(raw, parent) {
  const isFolder = raw.mimeType === FOLDER_MIME_TYPE;
  return {
    id: raw.id,
    name: raw.name,
    kind: isFolder ? NODE_KIND.FOLDER : NODE_KIND.FILE,
    mimeType: raw.mimeType,
    parentId: parent.folderId,
    path: `${parent.path}/${raw.name}`,
    sizeBytes: raw.size ? Number(raw.size) : null,
    modifiedTime: raw.modifiedTime ?? null,
    webViewLink: raw.webViewLink ?? null,
    iconLink: raw.iconLink ?? null,
  };
}

export function createEmptyProgress() {
  return {
    status: "idle",
    foldersScanned: 0,
    filesFound: 0,
    totalFoldersDiscovered: 0,
    currentFolderName: null,
    startedAt: null,
    elapsedMs: 0,
    lastError: null,
  };
}
