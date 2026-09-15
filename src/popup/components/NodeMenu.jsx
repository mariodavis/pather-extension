import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { getFullPath, getMarkdownLink, getRelativePath, getShareLink } from "@shared/pathUtils";
import { useToast } from "./ToastContext";

/** The "⋯" menu on every file/folder row — copy-path actions, wired to real clipboard writes. */
export function NodeMenu({ node }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const showToast = useToast();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const copy = async (text, label) => {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
    setOpen(false);
  };

  const copySubtree = async () => {
    const res = await messageBus.send({ type: MESSAGE_TYPES.SUBTREE_TEXT_GET, folderId: node.id });
    if (res.ok) {
      await navigator.clipboard.writeText(res.data.text);
      showToast("Subtree copied");
    } else {
      showToast("Couldn't copy subtree");
    }
    setOpen(false);
  };

  const hasLink = Boolean(node.webViewLink);
  const items = [
    { label: "Copy Path", onClick: () => copy(getFullPath(node), "Path") },
    { label: "Copy Relative Path", onClick: () => copy(getRelativePath(node), "Relative path") },
    { label: "Copy Markdown Link", onClick: () => copy(getMarkdownLink(node), "Markdown link"), disabled: !hasLink },
    { label: "Copy Share Link", onClick: () => copy(getShareLink(node), "Share link"), disabled: !hasLink },
  ];
  if (node.kind === "folder") {
    items.push({ label: "Copy Subtree", onClick: copySubtree });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-ink-soft"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More options"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20"
        >
          {items.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={item.onClick}
              disabled={item.disabled}
              className="w-full text-left px-3 py-2 text-[13px] text-ink hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
