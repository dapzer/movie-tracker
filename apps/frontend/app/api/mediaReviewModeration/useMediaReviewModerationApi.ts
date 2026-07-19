import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  GetMediaReviewModerationLogsArgs,
  ModerateMediaReviewArgs,
} from "~/api/mediaReviewModeration/mediaReviewModerationApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  getMediaReviewModerationLogsApi,
  moderateMediaReviewApi,
} from "~/api/mediaReviewModeration/mediaReviewModerationApi"
import { MediaReviewModerationApiQueryKeys } from "~/api/mediaReviewModeration/mediaReviewModerationApiQueryKeys"
import { MediaReviewsApiQueryKeys } from "~/api/mediaReviews/mediaReviewsApiQueryKeys"

export function useGetMediaReviewModerationLogsApi(
  args: Ref<GetMediaReviewModerationLogsArgs>,
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: [MediaReviewModerationApiQueryKeys.GET_LOGS_BY_REVIEW_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewModerationLogsApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useModerateMediaReviewApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewModerationApiQueryKeys.MODERATE],
    mutationFn: (args: ModerateMediaReviewArgs) => moderateMediaReviewApi(args),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [MediaReviewsApiQueryKeys.GET_LIST],
        }),
        queryClient.invalidateQueries({
          queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [MediaReviewsApiQueryKeys.GET_BY_USER_ID],
        }),
        queryClient.invalidateQueries({
          queryKey: [MediaReviewModerationApiQueryKeys.GET_LOGS_BY_REVIEW_ID],
        }),
      ])
    },
  })
}
