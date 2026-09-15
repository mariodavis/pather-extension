import { DRIVE_ROOT_PATH } from "./constants";

export function getFullPath(node) {
  return node.path;
}

export function getRelativePath(node) {
  const prefix = `${DRIVE_ROOT_PATH}/`;
  return node.path.startsWith(prefix) ? node.path.slice(prefix.length) : node.path;
}

export function getMarkdownLink(node) {
  return node.webViewLink ? `[${node.name}](${node.webViewLink})` : node.name;
}

export function getShareLink(node) {
  return node.webViewLink ?? "";
}
