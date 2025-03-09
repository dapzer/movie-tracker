import { useQuery } from "@tanstack/vue-query"
import { getAnalyticsRecordsApi } from "~/api/analytics/analyticsApi"
import { AnalyticsQueryKeys } from "~/api/analytics/analyticsApiQueryKeys"

export function useGetAnalyticsRecordsApi() {
  return useQuery({
    queryKey: [AnalyticsQueryKeys.GET_RECORDS],
    queryFn: () => getAnalyticsRecordsApi(),
  })
}
