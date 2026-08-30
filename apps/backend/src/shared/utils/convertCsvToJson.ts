import { parse } from "csv-parse/sync"

export function convertCsvToJson(content: string): Record<string, string>[] {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  })
}
