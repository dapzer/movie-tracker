import { useQuery } from "@tanstack/vue-query";
import { AnalyticsQueryKeys } from "~/api/analytics/analyticsApiQueryKeys";
import { getAnalyticsRecordsApi } from "~/api/analytics/analyticsApi";

export const useGetAnalyticsRecordsApi = () => {
  return useQuery({
    queryKey: [AnalyticsQueryKeys.GET_RECORDS],
    queryFn: () => getAnalyticsRecordsApi()
  })
}
