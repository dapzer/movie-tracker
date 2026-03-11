import { useMutation } from "@tanstack/vue-query"
import { sendMediaListView } from "~/api/mediaListViews/mediaListViewsApi"
import { MediaListViewsApiQueryKeys } from "~/api/mediaListViews/mediaListViewsApiQueryKeys"

export function useSendMediaListViewApi() {
  return useMutation({
    mutationKey: [MediaListViewsApiQueryKeys.SEND],
    mutationFn: sendMediaListView,
  })
}
