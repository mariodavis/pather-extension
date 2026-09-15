import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Folder, MoreHorizontal } from "lucide-react";
import { useDriveChildren } from "@popup/hooks/useDriveTree";
import { FileRow } from "./FileRow";

export function FolderNode({ node, depth, counts = {} }) {
  const [expanded, setExpanded] = useState(false);
  const { childrenByParent, loadChildren, loadingId } = useDriveChildren();
  const children = childrenByParent[node.id];

  useEffect(() => {
    if (expanded && !children) loadChildren(node.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-left min-w-0 flex-1"
        >
          {expanded ? (
            <ChevronDown size={14} className="text-ink-soft shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-ink-soft shrink-0" />
          )}
          <Folder size={16} className="text-brand shrink-0" fill="#FDF1DD" />
          <span className="font-medium text-[14px] truncate">{node.name}</span>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          {counts[node.id] !== undefined && (
            <span className="text-xs bg-gray-100 text-ink-muted rounded-full px-2 py-0.5">
              {counts[node.id]}
            </span>
          )}
          <button className="text-ink-soft">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pl-4">
          {loadingId === node.id && <p className="text-xs text-ink-muted py-1">Loading…</p>}
          {children
            ?.filter((c) => c.kind === "folder")
            .map((folder) => (
              <FolderNode key={folder.id} node={folder} depth={depth + 1} counts={counts} />
            ))}
          {children
            ?.filter((c) => c.kind === "file")
            .map((file) => (
              <div key={file.id} className="pl-6">
                <FileRow node={file} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
