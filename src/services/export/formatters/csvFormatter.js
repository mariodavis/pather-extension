const HEADERS = ["Name", "Type", "Path", "Size (bytes)", "Modified", "Link"];

function escapeCell(value) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(nodes) {
  const rows = nodes.map((n) =>
    [n.name, n.kind, n.path, n.sizeBytes ?? "", n.modifiedTime ?? "", n.webViewLink ?? ""]
      .map((cell) => escapeCell(String(cell)))
      .join(","),
  );
  return [HEADERS.join(","), ...rows].join("\n");
}
