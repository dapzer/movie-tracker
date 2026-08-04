export type UiFilterOptionValue = string | number

export interface UiFilterOption<TValue extends UiFilterOptionValue> {
  label: string | number
  value: TValue
}

export type UiRangeFilterValue = [number, number]
export type UiDateRangeFilterValue = [number | undefined, number | undefined]
export type UiMultiSelectFilterValue = Array<string>
export type UiSingleSelectFilterValue = string | number | undefined

export interface UiMultiSelectFilterConfig {
  type: "multiSelect"
  id: string
  title: string
  options: UiFilterOption<string>[]
  drawerVariant: "checkbox" | "tag"
}

export interface UiSingleSelectFilterConfig {
  type: "singleSelect"
  id: string
  title: string
  options: UiFilterOption<UiFilterOptionValue>[]
  initialValue?: UiFilterOptionValue
}

export interface UiRangeFilterConfig {
  type: "range"
  id: string
  title: string
  min: number
  max: number
  step?: number
  minLabel?: string
  maxLabel?: string
  getLabel?: (value: number) => string | undefined
  initialValue?: UiRangeFilterValue
}

export interface UiDateRangeFilterConfig {
  type: "dateRange"
  id: string
  title: string
  fromLabel: string
  toLabel: string
  minYear?: number
  maxYear?: number
  shortcuts?: number[]
  initialValue?: UiDateRangeFilterValue
}

export type UiFilterConfig = UiMultiSelectFilterConfig
  | UiSingleSelectFilterConfig
  | UiRangeFilterConfig
  | UiDateRangeFilterConfig

export type UiFilterModelValue<TConfig extends UiFilterConfig> = TConfig extends UiMultiSelectFilterConfig
  ? UiMultiSelectFilterValue
  : TConfig extends UiSingleSelectFilterConfig
    ? UiSingleSelectFilterValue
    : TConfig extends UiRangeFilterConfig
      ? UiRangeFilterValue
      : TConfig extends UiDateRangeFilterConfig
        ? UiDateRangeFilterValue
        : never

export type UiFiltersModelValue
    = | UiRangeFilterValue
      | UiDateRangeFilterValue
      | UiMultiSelectFilterValue
      | UiSingleSelectFilterValue
      | undefined

export type UiFiltersModel<TConfig extends UiFilterConfig[]> = Record<string, UiFiltersModelValue> & {
  [TFilter in TConfig[number] as TFilter["id"]]: UiFilterModelValue<TFilter>
}

export type UiFiltersFallbackModel = Record<string, UiFiltersModelValue>
