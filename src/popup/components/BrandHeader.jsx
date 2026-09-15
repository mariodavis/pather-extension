import { MoreVertical, Settings, Sun } from "lucide-react";

/** The top identity row — present on every screen, exactly as in the mockups. */
export function BrandHeader() {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-brand text-white grid place-items-center font-bold text-lg shrink-0">
          P
        </div>
        <div>
          <p className="font-bold text-[17px] leading-tight text-ink">Pather</p>
          <p className="text-xs text-ink-muted leading-tight">
            Map. Search. <span className="text-brand font-medium">Understand.</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-ink-muted">
        <Sun size={18} strokeWidth={1.75} />
        <Settings size={18} strokeWidth={1.75} />
        <MoreVertical size={18} strokeWidth={1.75} />
      </div>
    </div>
  );
}
