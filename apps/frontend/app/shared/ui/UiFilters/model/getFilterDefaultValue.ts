import type { UiFilterConfig, UiFiltersModelValue } from "./types.ts"

export function getFilterDefaultValue(filter: UiFilterConfig): UiFiltersModelValue {
  switch (filter.type) {
    case "multiSelect":
      return []
    case "singleSelect":
      return filter.initialValue
    case "range":
      return filter.initialValue ? [...filter.initialValue] : [filter.min, filter.max]
    case "dateRange":
      return filter.initialValue ? [...filter.initialValue] : [undefined, undefined]
  }
}
