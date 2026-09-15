import { EXPORT_FORMAT } from "@shared/constants";
import { toCsv } from "./formatters/csvFormatter";
import { toJson } from "./formatters/jsonFormatter";
import { toTxt } from "./formatters/txtFormatter";

const FORMATTERS = {
  [EXPORT_FORMAT.CSV]: { build: toCsv, mimeType: "text/csv", extension: "csv" },
  [EXPORT_FORMAT.JSON]: { build: toJson, mimeType: "application/json", extension: "json" },
  [EXPORT_FORMAT.TXT]: { build: toTxt, mimeType: "text/plain", extension: "txt" },
};

export class ExportService {
  constructor(repository) {
    this.repository = repository;
  }

  async export(format, nodeIds) {
    const all = await this.repository.getAll();
    const nodes = nodeIds ? all.filter((n) => nodeIds.includes(n.id)) : all;
    const formatter = FORMATTERS[format];
    if (!formatter) throw new Error(`Unsupported export format: ${format}`);

    return {
      content: formatter.build(nodes),
      filename: `pather-drive-export.${formatter.extension}`,
      mimeType: formatter.mimeType,
    };
  }
}
