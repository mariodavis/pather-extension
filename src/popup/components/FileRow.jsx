import { useState } from "react";
import { FileText, Folder, MoreHorizontal } from "lucide-react";

function formatSize(bytes) {
  if (bytes === null || bytes === undefined) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function FileIcon({ node }) {
  if (node.kind === "folder") return <Folder size={20} className="text-brand" fill="#FDF1DD" />;
  if (node.mimeType === "application/pdf") {
    return (
      <div className="w-6 h-7 rounded-[3px] bg-pdf text-white grid place-items-center text-[8px] font-bold shrink-0">
        PDF
      </div>
    );
  }
  return <FileText size={20} className="text-ink-soft" />;
}

export function FileRow({ node }) {
  const [copied, setCopied] = useState(false);
  const crumbs = node.path.split("/").slice(1, -1);
  const breadcrumb = crumbs.length ? crumbs.slice(-3).join(" > ") : "My Drive";

  const copyLink = async () => {
    if (!node.webViewLink) return;
    await navigator.clipboard.writeText(node.webViewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <FileIcon node={node} />
        <div className="min-w-0">
          <p className="font-semibold text-[14px] truncate text-ink">{node.name}</p>
          <p className="text-xs text-ink-muted truncate">{breadcrumb}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right text-xs text-ink-muted leading-tight">
          <p>{formatSize(node.sizeBytes)}</p>
          <p>{formatDate(node.modifiedTime)}</p>
        </div>
        <button
          onClick={copyLink}
          disabled={!node.webViewLink}
          className="text-ink-soft disabled:opacity-30"
          title={copied ? "Copied!" : "Copy link"}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
