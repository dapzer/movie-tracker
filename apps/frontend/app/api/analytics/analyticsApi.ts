import type { AnalyticsRecords } from "@movie-tracker/types"
import { api } from "~/api/instance"

export async function getAnalyticsRecordsApi() {
  return api.get<AnalyticsRecords>("analytics/records")
}
