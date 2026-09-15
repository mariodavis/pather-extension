function sortNodes(nodes) {
  return nodes.slice().sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Renders a folder and its real scanned descendants as a connector-style
 * ASCII tree, e.g.:
 *   Accounts
 *   ├── 2018
 *   │   └── January.xlsx
 *   └── 2020
 */
export function toAsciiTree(rootName, rootId, descendants) {
  const childrenByParent = new Map();
  for (const node of descendants) {
    const bucket = childrenByParent.get(node.parentId) ?? [];
    bucket.push(node);
    childrenByParent.set(node.parentId, bucket);
  }

  const lines = [rootName];
  const walk = (parentId, prefix) => {
    const kids = sortNodes(childrenByParent.get(parentId) ?? []);
    kids.forEach((kid, index) => {
      const isLast = index === kids.length - 1;
      lines.push(`${prefix}${isLast ? "└── " : "├── "}${kid.name}`);
      if (kid.kind === "folder") {
        walk(kid.id, `${prefix}${isLast ? "    " : "│   "}`);
      }
    });
  };

  walk(rootId, "");
  return lines.join("\n");
}
