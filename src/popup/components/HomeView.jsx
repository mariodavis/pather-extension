import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Download, Folder, FolderTree, Search, Sparkles } from "lucide-react";
import { useDriveAuth } from "@popup/hooks/useDriveAuth";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { BrandHeader } from "./BrandHeader";
import { GoogleLogo } from "./GoogleLogo";
import { ReadOnlyBanner } from "./ReadOnlyBanner";

const TILES = [
  { to: "/scan", Icon: Folder, title: "Scan Drive", subtitle: "Discover all folders and files" },
  { to: "/tree", Icon: FolderTree, title: "Drive Tree", subtitle: "Visualize your Drive hierarchy" },
  { to: "/search", Icon: Search, title: "Search Files", subtitle: "Find any file by name or path" },
  { to: "/exports", Icon: Download, title: "Exports", subtitle: "Export as CSV, JSON, TXT and more" },
];

export function HomeView() {
  const { connected, loading, connect } = useDriveAuth();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      messageBus.send({ type: MESSAGE_TYPES.STATS_GET }).then((res) => res.ok && setStats(res.data));
    }
  }, [connected]);

  return (
    <div className="flex flex-col">
      <BrandHeader />
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="relative overflow-hidden bg-brand-light rounded-card p-4">
          <div className="max-w-[70%]">
            <p className="flex items-center gap-1.5 font-bold text-[15px] text-ink">
              <Sparkles size={16} className="text-brand shrink-0" />
              See your entire Drive
              <br className="hidden" />
              like never before.
            </p>
            <p className="text-[13px] text-ink-muted mt-2 leading-snug">
              Pather scans your Google Drive (metadata only) and builds a beautiful map of your
              folders and files.
            </p>
          </div>
          <FolderTree size={72} strokeWidth={1.25} className="absolute right-4 top-4 text-brand/25" />
        </div>

        {!connected ? (
          <button
            onClick={connect}
            disabled={loading}
            className="bg-ink text-white rounded-card p-4 flex items-center gap-3 disabled:opacity-60"
          >
            <div className="w-9 h-9 rounded-full bg-white grid place-items-center shrink-0">
              <GoogleLogo size={18} />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-[15px]">Connect Google Drive</p>
              <p className="text-xs text-white/60">Authorize Pather to scan your drive</p>
            </div>
            <ChevronRight size={20} className="text-white/70 shrink-0" />
          </button>
        ) : (
          stats && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-card p-3">
                <p className="font-bold">{stats.folderCount}</p>
                <p className="text-xs text-ink-muted">Folders</p>
              </div>
              <div className="bg-gray-50 rounded-card p-3">
                <p className="font-bold">{stats.fileCount}</p>
                <p className="text-xs text-ink-muted">Files</p>
              </div>
              <div className="bg-gray-50 rounded-card p-3">
                <p className="font-bold">{(stats.totalSizeBytes / 1e9).toFixed(1)} GB</p>
                <p className="text-xs text-ink-muted">Size</p>
              </div>
            </div>
          )
        )}

        <div className="grid grid-cols-2 gap-3">
          {TILES.map(({ to, Icon, title, subtitle }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="text-left border border-gray-100 rounded-card p-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-light grid place-items-center mb-2.5">
                <Icon size={19} className="text-brand" strokeWidth={2} />
              </div>
              <p className="font-semibold text-[14px] text-ink">{title}</p>
              <p className="text-xs text-ink-muted leading-snug mt-0.5">{subtitle}</p>
            </button>
          ))}
        </div>

        <ReadOnlyBanner tone="brand" subtitle="We only read metadata. Your files stay private." />
      </div>
    </div>
  );
}
