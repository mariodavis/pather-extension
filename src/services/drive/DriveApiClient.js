import { DRIVE_API_BASE, DRIVE_FILE_FIELDS, DRIVE_PAGE_SIZE } from "@shared/constants";

/**
 * Every call goes to the real Drive API for the signed-in account.
 * `auth` only needs a getToken(interactive) method (duck-typed DI),
 * so it can be swapped or mocked in tests without touching this class.
 */
export class DriveApiClient {
  constructor(auth) {
    this.auth = auth;
  }

  async listChildren(folderId) {
    const results = [];
    let pageToken;

    do {
      const page = await this.fetchPage(folderId, pageToken);
      results.push(...page.files);
      pageToken = page.nextPageToken;
    } while (pageToken);

    return results;
  }

  async fetchPage(folderId, pageToken) {
    const token = await this.auth.getToken(false);
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: `nextPageToken, files(${DRIVE_FILE_FIELDS})`,
      pageSize: String(DRIVE_PAGE_SIZE),
      spaces: "drive",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Drive API error (${response.status}): ${body}`);
    }

    return response.json();
  }
}
