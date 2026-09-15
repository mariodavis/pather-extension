import { NODES_STORE, NODE_KIND } from "@shared/constants";
import { getDb } from "./db";

export class DriveRepository {
  async upsertMany(nodes) {
    if (nodes.length === 0) return;
    const db = await getDb();
    const tx = db.transaction(NODES_STORE, "readwrite");
    await Promise.all([...nodes.map((node) => tx.store.put(node)), tx.done]);
  }

  async getChildren(parentId) {
    const db = await getDb();
    return db.getAllFromIndex(NODES_STORE, "by-parent", parentId);
  }

  async getById(id) {
    const db = await getDb();
    return db.get(NODES_STORE, id);
  }

  /** Every node nested under a folder, at any depth — real BFS over scanned data. */
  async getDescendants(folderId) {
    const all = await this.getAll();
    const childrenByParent = new Map();
    for (const node of all) {
      const bucket = childrenByParent.get(node.parentId) ?? [];
      bucket.push(node);
      childrenByParent.set(node.parentId, bucket);
    }

    const result = [];
    const queue = [...(childrenByParent.get(folderId) ?? [])];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);
      if (node.kind === NODE_KIND.FOLDER) {
        queue.push(...(childrenByParent.get(node.id) ?? []));
      }
    }
    return result;
  }

  async getAll() {
    const db = await getDb();
    return db.getAll(NODES_STORE);
  }

  async searchByName(term) {
    const needle = term.trim().toLowerCase();
    if (!needle) return [];
    const all = await this.getAll();
    return all.filter((node) => node.name.toLowerCase().includes(needle));
  }

  async getStats() {
    const all = await this.getAll();
    const folderCount = all.filter((n) => n.kind === NODE_KIND.FOLDER).length;
    const fileCount = all.length - folderCount;
    const totalSizeBytes = all.reduce((sum, n) => sum + (n.sizeBytes ?? 0), 0);
    const lastScanAt = all.length
      ? Math.max(...all.map((n) => (n.modifiedTime ? Date.parse(n.modifiedTime) : 0)))
      : null;
    return { folderCount, fileCount, totalSizeBytes, lastScanAt };
  }

  /** Recursive item count per folder — real, derived from scanned data, never estimated. */
  async getDescendantCounts() {
    const all = await this.getAll();
    const childrenByParent = new Map();
    for (const node of all) {
      const bucket = childrenByParent.get(node.parentId) ?? [];
      bucket.push(node);
      childrenByParent.set(node.parentId, bucket);
    }

    const memo = new Map();
    const countUnder = (folderId) => {
      if (memo.has(folderId)) return memo.get(folderId);
      const children = childrenByParent.get(folderId) ?? [];
      let total = children.length;
      for (const child of children) {
        if (child.kind === NODE_KIND.FOLDER) total += countUnder(child.id);
      }
      memo.set(folderId, total);
      return total;
    };

    const counts = {};
    for (const node of all) {
      if (node.kind === NODE_KIND.FOLDER) counts[node.id] = countUnder(node.id);
    }
    return counts;
  }

  async clear() {
    const db = await getDb();
    await db.clear(NODES_STORE);
  }
}

export const driveRepository = new DriveRepository();
