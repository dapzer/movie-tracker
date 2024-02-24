import { generateApiUrl } from "@movie-tracker/utils";
import { fetchWihCredentials } from "~/utils/fetchWihCredentials";
import type { AnalyticsRecords } from "@movie-tracker/types";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const getAnalyticsRecordsApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/analytics/records"));
  const data = await response.json();

  if (response.ok) {
    return data as AnalyticsRecords;
  }

  throw new Error(`Error when getting analytics records. Code: ${data.statusCode}`);
}
