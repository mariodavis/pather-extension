import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { BrandHeader } from "./BrandHeader";
import { PageHeader } from "./PageHeader";

const FORMATS = [
  { id: "csv", label: "CSV", description: "Open in Sheets or Excel", Icon: FileSpreadsheet },
  { id: "json", label: "JSON", description: "Structured data for scripts", Icon: FileJson },
  { id: "txt", label: "TXT", description: "Plain-text folder listing", Icon: FileText },
];

export function ExportsView() {
  const [exporting, setExporting] = useState(null);

  const runExport = async (format) => {
    setExporting(format);
    const res = await messageBus.send({ type: MESSAGE_TYPES.EXPORT_RUN, format });
    if (res.ok) {
      const blob = new Blob([res.data.content], { type: res.data.mimeType });
      const url = URL.createObjectURL(blob);
      await chrome.downloads.download({ url, filename: res.data.filename, saveAs: true });
      URL.revokeObjectURL(url);
    }
    setExporting(null);
  };

  return (
    <div className="flex flex-col">
      <BrandHeader />
      <PageHeader title="Exports" />
      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm text-ink-muted">
          Export everything Pather has mapped so far, in the format you need.
        </p>
        {FORMATS.map(({ id, label, description, Icon }) => (
          <button
            key={id}
            onClick={() => runExport(id)}
            disabled={exporting !== null}
            className="flex items-center gap-3 border border-gray-100 rounded-card p-4 disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-full bg-brand-light grid place-items-center shrink-0">
              <Icon size={18} className="text-brand" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-[14px]">{label}</p>
              <p className="text-xs text-ink-muted">{description}</p>
            </div>
            {exporting === id ? (
              <Loader2 size={18} className="animate-spin text-brand shrink-0" />
            ) : (
              <Download size={18} className="text-ink-soft shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
