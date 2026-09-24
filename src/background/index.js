import { authService } from "@services/auth/AuthService";
import { DriveApiClient } from "@services/drive/DriveApiClient";
import { ScanService } from "@services/scan/ScanService";
import { driveRepository } from "@services/storage/DriveRepository";
import { ExportService } from "@services/export/ExportService";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { DRIVE_ROOT_ID } from "@shared/constants";

// Composition root: every service is built once here and wired via
// constructor injection, so each unit can be tested in isolation.
const driveApiClient = new DriveApiClient(authService);
const scanService = new ScanService(driveApiClient, driveRepository);
const exportService = new ExportService(driveRepository);

function broadcastProgress(progress) {
  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SCAN_PROGRESS_EVENT, progress }).catch(() => {
    // No popup is open to receive it — safe to ignore.
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pather-scan-resume") {
    scanService.resumeIfNeeded(broadcastProgress);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((error) => sendResponse({ ok: false, error: error?.message ?? "Unknown error" }));
  return true; // keep the message channel open for the async response
});

async function handleMessage(message) {
  switch (message.type) {
    case MESSAGE_TYPES.AUTH_CONNECT: {
      await authService.connect();
      return { ok: true, data: undefined };
    }
    case MESSAGE_TYPES.AUTH_STATUS: {
      const connected = await authService.isConnected();
      return { ok: true, data: { connected } };
    }
    case MESSAGE_TYPES.AUTH_DISCONNECT: {
      await authService.disconnect();
      return { ok: true, data: undefined };
    }
    case MESSAGE_TYPES.SCAN_START: {
      scanService.start(broadcastProgress); // fire-and-forget, progress streams via events
      return { ok: true, data: undefined };
    }
    case MESSAGE_TYPES.SCAN_STOP: {
      await scanService.stop();
      return { ok: true, data: undefined };
    }
    case MESSAGE_TYPES.SCAN_PROGRESS_GET: {
      const progress = await scanService.getProgress();
      return { ok: true, data: progress };
    }
    case MESSAGE_TYPES.TREE_CHILDREN_GET: {
      const children = await driveRepository.getChildren(message.parentId ?? DRIVE_ROOT_ID);
      return { ok: true, data: children };
    }
    case MESSAGE_TYPES.TREE_COUNTS_GET: {
      const counts = await driveRepository.getDescendantCounts();
      return { ok: true, data: counts };
    }
    case MESSAGE_TYPES.SUBTREE_TEXT_GET: {
      const descendants = await driveRepository.getDescendants(message.folderId);
      const text = descendants.map((n) => n.path).join("\n");
      return { ok: true, data: { text } };
    }
    case MESSAGE_TYPES.SEARCH_RUN: {
      const matches = await driveRepository.searchByName(message.query.term);
      const filtered = applyFilters(matches, message.query.filters ?? {});
      return { ok: true, data: filtered };
    }
    case MESSAGE_TYPES.STATS_GET: {
      const stats = await driveRepository.getStats();
      return { ok: true, data: stats };
    }
    case MESSAGE_TYPES.EXPORT_RUN: {
      const result = await exportService.export(message.format, message.nodeIds);
      return { ok: true, data: result };
    }
    default:
      return { ok: false, error: "Unknown message type" };
  }
}

function applyFilters(nodes, filters) {
  return nodes.filter((node) => {
    if (filters.kind && node.kind !== filters.kind) return false;
    if (filters.mimeType && node.mimeType !== filters.mimeType) return false;
    if (filters.parentPath && !node.path.startsWith(filters.parentPath)) return false;
    return true;
  });
}