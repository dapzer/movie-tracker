import type { AnalyticsRecords } from "@movie-tracker/types";
import { api } from "~/api/instance";

export const getAnalyticsRecordsApi = async () => {
  return api.get<AnalyticsRecords>("analytics/records");
};
