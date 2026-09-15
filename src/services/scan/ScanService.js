import { DRIVE_ROOT_ID, DRIVE_ROOT_PATH, SCAN_STATUS, SCAN_TIME_BUDGET_MS } from "@shared/constants";
import { createDriveNode, createEmptyProgress } from "@shared/driveNode";

const STORAGE_KEY = "pather.scanState";
const RESUME_ALARM = "pather-scan-resume";

/**
 * Crawls the Drive folder tree breadth-first, one folder's children per
 * API round trip. State is persisted after every folder so the scan can
 * resume from where it left off if the MV3 service worker is unloaded.
 */
export class ScanService {
  constructor(driveApi, repository) {
    this.driveApi = driveApi;
    this.repository = repository;
    this.stopRequested = false;
  }

  async start(onProgress) {
    await this.repository.clear();
    const state = {
      progress: { ...createEmptyProgress(), status: SCAN_STATUS.SCANNING, startedAt: Date.now() },
      queue: [{ folderId: DRIVE_ROOT_ID, path: DRIVE_ROOT_PATH }],
      visitedFolderIds: [],
    };
    await this.persist(state);
    await this.run(state, onProgress);
  }

  async resumeIfNeeded(onProgress) {
    const state = await this.load();
    if (state?.progress.status === SCAN_STATUS.SCANNING || state?.progress.status === SCAN_STATUS.PAUSED) {
      await this.run(state, onProgress);
    }
  }

  async stop() {
    this.stopRequested = true;
  }

  async getProgress() {
    const state = await this.load();
    return state?.progress ?? createEmptyProgress();
  }

  /** Processes the queue until it drains, the time budget is hit, or the caller cancels. */
  async run(state, onProgress) {
    this.stopRequested = false;
    const sliceStart = Date.now();

    try {
      while (state.queue.length > 0) {
        if (this.stopRequested) {
          state.progress.status = SCAN_STATUS.PAUSED;
          await this.persist(state);
          onProgress(state.progress);
          return;
        }

        if (Date.now() - sliceStart > SCAN_TIME_BUDGET_MS) {
          await this.persist(state);
          onProgress(state.progress);
          chrome.alarms.create(RESUME_ALARM, { delayInMinutes: 0.01 });
          return;
        }

        const next = state.queue.shift();
        if (state.visitedFolderIds.includes(next.folderId)) continue;

        state.progress.currentFolderName = next.path.split("/").pop() ?? next.path;
        const children = await this.driveApi.listChildren(next.folderId);
        const nodes = children.map((child) => createDriveNode(child, next));

        await this.repository.upsertMany(nodes);

        const childFolders = nodes.filter((n) => n.kind === "folder");
        state.queue.push(...childFolders.map((f) => ({ folderId: f.id, path: f.path })));
        state.visitedFolderIds.push(next.folderId);

        state.progress.foldersScanned += 1;
        state.progress.filesFound += nodes.length;
        state.progress.totalFoldersDiscovered = state.visitedFolderIds.length + state.queue.length;
        state.progress.elapsedMs = Date.now() - (state.progress.startedAt ?? Date.now());

        await this.persist(state);
        onProgress(state.progress);
      }

      state.progress.status = SCAN_STATUS.COMPLETED;
      state.progress.currentFolderName = null;
      await this.persist(state);
      onProgress(state.progress);
    } catch (error) {
      state.progress.status = SCAN_STATUS.ERROR;
      state.progress.lastError = error instanceof Error ? error.message : "Unknown scan error";
      await this.persist(state);
      onProgress(state.progress);
    }
  }

  async persist(state) {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  async load() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] ?? null;
  }
}
