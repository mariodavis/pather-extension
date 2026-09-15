import { useEffect, useState } from "react";
import { Clock, FileText, Filter, Folder, HardDrive, RotateCw, Search } from "lucide-react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { DRIVE_ROOT_ID } from "@shared/constants";
import { useDriveCounts } from "@popup/hooks/useDriveTree";
import { BrandHeader } from "./BrandHeader";
import { PageHeader } from "./PageHeader";
import { FolderNode } from "./FolderNode";
import { SuccessBanner } from "./ReadOnlyBanner";

function GoogleDriveTriangle() {
  return (
    <svg width="18" height="18" viewBox="0 0 87.3 78" aria-hidden>
      <path fill="#0066DA" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" />
      <path fill="#00AC47" d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 47.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" />
      <path fill="#EA4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 56.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z" />
      <path fill="#00832D" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" />
      <path fill="#2684FC" d="M59.8 52H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
      <path fill="#FFBA00" d="M73.4 26.5 60.6 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.55 25l16.25 27h27.45c0-1.55-.4-3.1-1.2-4.5z" />
    </svg>
  );
}

export function TreeView() {
  const [stats, setStats] = useState(null);
  const [rootChildren, setRootChildren] = useState([]);
  const counts = useDriveCounts();

  const loadRoot = () => {
    messageBus.send({ type: MESSAGE_TYPES.STATS_GET }).then((res) => res.ok && setStats(res.data));
    messageBus
      .send({ type: MESSAGE_TYPES.TREE_CHILDREN_GET, parentId: DRIVE_ROOT_ID })
      .then((res) => res.ok && setRootChildren(res.data));
  };

  useEffect(loadRoot, []);

  return (
    <div className="flex flex-col">
      <BrandHeader />
      <PageHeader
        title="Drive Tree"
        actions={
          <>
            <button className="w-8 h-8 grid place-items-center border border-gray-200 rounded-lg text-ink-muted">
              <Search size={16} />
            </button>
            <button className="w-8 h-8 grid place-items-center border border-gray-200 rounded-lg text-ink-muted">
              <Filter size={16} />
            </button>
          </>
        }
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-4 gap-2 text-center bg-gray-50 rounded-card p-3">
          <div>
            <Folder size={18} className="mx-auto text-brand mb-1" />
            <p className="font-bold text-[15px]">{stats?.folderCount ?? "—"}</p>
            <p className="text-[10px] text-ink-muted">Folders</p>
          </div>
          <div>
            <FileText size={18} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">{stats?.fileCount ?? "—"}</p>
            <p className="text-[10px] text-ink-muted">Files</p>
          </div>
          <div>
            <HardDrive size={18} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">
              {stats ? `${(stats.totalSizeBytes / 1e9).toFixed(1)} GB` : "—"}
            </p>
            <p className="text-[10px] text-ink-muted">Size (Metadata)</p>
          </div>
          <div>
            <Clock size={18} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">
              {stats?.lastScanAt ? new Date(stats.lastScanAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "—"}
            </p>
            <p className="text-[10px] text-ink-muted">Last Scan</p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-card p-3">
          <p className="font-semibold mb-1 flex items-center gap-2 text-[14px]">
            <GoogleDriveTriangle /> My Drive
          </p>
          {rootChildren.length === 0 && (
            <p className="text-xs text-ink-muted py-2">
              No data yet — run a scan first from the Scan tab.
            </p>
          )}
          {rootChildren
            .filter((n) => n.kind === "folder")
            .map((folder) => (
              <FolderNode key={folder.id} node={folder} depth={0} counts={counts} />
            ))}
        </div>

        {stats && stats.folderCount > 0 && (
          <SuccessBanner
            title="Scan completed successfully!"
            subtitle="Your drive map is ready to explore."
            actionLabel="Rescan"
            actionIcon={RotateCw}
            onAction={loadRoot}
          />
        )}
      </div>
    </div>
  );
}
