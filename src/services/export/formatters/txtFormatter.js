export function toTxt(nodes) {
  return nodes
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((n) => `${n.kind === "folder" ? "[DIR]" : "     "} ${n.path}`)
    .join("\n");
}
