export const DataImportSourceEnum = {
  LETTERBOXD: "letterboxd",
  TRAKT: "trakt",
} as const

export type DataImportSource = (typeof DataImportSourceEnum)[keyof typeof DataImportSourceEnum]
