import { CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

const VARIANTS = {
  brand: {
    wrap: "bg-brand-light",
    icon: "text-brand",
    Icon: ShieldCheck,
  },
  info: {
    wrap: "bg-info-light",
    icon: "text-info",
    Icon: ShieldCheck,
  },
};

/**
 * Read-only disclosure banner. The mockups use two color treatments —
 * peach on Home, blue on Scan — so `tone` picks which one renders.
 */
export function ReadOnlyBanner({ tone = "brand", subtitle = "We only read metadata. Your files stay private." }) {
  const { wrap, icon, Icon } = VARIANTS[tone];
  return (
    <div className={`flex items-center gap-3 rounded-card p-4 ${wrap}`}>
      <Icon size={22} className={icon} strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="font-semibold text-sm text-ink">Read-only access</p>
        <p className="text-xs text-ink-muted">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-ink-soft ml-auto shrink-0" />
    </div>
  );
}

export function SuccessBanner({ title, subtitle, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="flex items-center gap-3 bg-success-light rounded-card p-4">
      <CheckCircle2 size={22} className="text-success" strokeWidth={1.75} fill="#22C55E" color="white" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{subtitle}</p>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 rounded-full px-3 py-1.5 bg-white shrink-0"
        >
          {ActionIcon && <ActionIcon size={14} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
