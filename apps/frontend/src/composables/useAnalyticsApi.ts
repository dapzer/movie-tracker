import { useQuery } from "@tanstack/vue-query";
import { AnalyticsQueryKeys } from "~/constants/queryKeys";
import { getAnalyticsRecordsApi } from "~/api/analyticsApi";

export const useGetAnalyticsRecordsApi = () => {
  return useQuery({
    queryKey: [AnalyticsQueryKeys.GET_RECORDS],
    queryFn: () => getAnalyticsRecordsApi()
  })
}
