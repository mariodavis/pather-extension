import { useEffect, useState } from "react";
import { CheckCircle2, Clock, FileText, Folder, List, Loader2 } from "lucide-react";
import { useScanProgress } from "@popup/hooks/useScanProgress";
import { BrandHeader } from "./BrandHeader";
import { PageHeader } from "./PageHeader";
import { ProgressRing } from "./ProgressRing";
import { ReadOnlyBanner } from "./ReadOnlyBanner";

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function ScanView() {
  const { progress, start, stop } = useScanProgress();
  const [log, setLog] = useState([]);

  const scanning = progress.status === "scanning";
  const percent = progress.totalFoldersDiscovered
    ? (progress.foldersScanned / progress.totalFoldersDiscovered) * 100
    : 0;

  const handleStart = async () => {
    setLog([]);
    await start();
  };

  useEffect(() => {
    const folder = progress.currentFolderName;
    if (!folder) return;
    setLog((prev) => {
      if (prev[0]?.name === folder) return prev;
      const entry = { name: folder, time: new Date(), done: false };
      const updated = prev.map((e) => ({ ...e, done: true }));
      return [entry, ...updated].slice(0, 6);
    });
  }, [progress.currentFolderName]);

  return (
    <div className="flex flex-col">
      <BrandHeader />
      <PageHeader title="Scan Drive" />
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-brand-light rounded-card p-4 flex items-center gap-4">
          <ProgressRing percent={percent} label={scanning ? "Scanning…" : progress.status} />
          <div>
            <p className="font-bold text-[15px] text-ink">Scanning your Google Drive</p>
            <p className="text-xs text-ink-muted mt-1 leading-snug">
              Pather is reading metadata and building your drive map.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="border border-gray-100 rounded-card p-2.5">
            <Folder size={16} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">{progress.totalFoldersDiscovered}</p>
            <p className="text-[10px] text-ink-muted">Folders</p>
          </div>
          <div className="border border-gray-100 rounded-card p-2.5">
            <FileText size={16} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">{progress.filesFound}</p>
            <p className="text-[10px] text-ink-muted">Files</p>
          </div>
          <div className="border border-gray-100 rounded-card p-2.5">
            <Clock size={16} className="mx-auto text-ink-muted mb-1" />
            <p className="font-bold text-[15px]">{formatElapsed(progress.elapsedMs)}</p>
            <p className="text-[10px] text-ink-muted">Elapsed</p>
          </div>
          <div className="border border-gray-100 rounded-card p-2.5">
            <Loader2 size={16} className="mx-auto text-brand mb-1 animate-spin" />
            <p className="font-semibold text-[11px] truncate">
              {progress.currentFolderName ?? "—"}
            </p>
            <p className="text-[10px] text-ink-muted">Current</p>
          </div>
        </div>

        <div>
          <div className="h-1.5 w-full bg-brand-light rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-ink-muted mt-2">
            This may take a few minutes depending on the size of your Drive.
          </p>
        </div>

        <div className="border border-gray-100 rounded-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="flex items-center gap-2 font-semibold text-[14px]">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Live Progress
            </p>
            <button className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 rounded-full px-3 py-1.5">
              <List size={14} />
              View Log
            </button>
          </div>
          {log.length === 0 && <p className="text-xs text-ink-muted py-1">Nothing scanned yet.</p>}
          {log.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Folder size={18} className="text-brand shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Scanning folder: {entry.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-ink-muted">
                  {entry.time.toLocaleTimeString(undefined, { hour12: true })}
                </span>
                {entry.done ? (
                  <CheckCircle2 size={18} className="text-success" fill="#22C55E" color="white" />
                ) : (
                  <Loader2 size={18} className="text-brand animate-spin" />
                )}
              </div>
            </div>
          ))}
          {progress.lastError && <p className="text-sm text-red-600 mt-2">{progress.lastError}</p>}
        </div>

        <button
          onClick={scanning ? stop : handleStart}
          className="bg-brand text-white rounded-card py-3 font-semibold"
        >
          {scanning ? "Pause scan" : progress.status === "paused" ? "Resume scan" : "Start scan"}
        </button>

        <ReadOnlyBanner tone="info" subtitle="We only read metadata. Your files stay safe and private." />
      </div>
    </div>
  );
}
