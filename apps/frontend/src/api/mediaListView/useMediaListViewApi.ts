import { useMutation } from "@tanstack/vue-query"
import { sendMediaListView } from "~/api/mediaListView/mediaListViewApi"
import { MediaListViewApiQueryKeys } from "~/api/mediaListView/mediaListViewApiQueryKeys"

export function useSendMediaListViewApi() {
  return useMutation({
    mutationKey: [MediaListViewApiQueryKeys.SEND],
    mutationFn: sendMediaListView,
  })
}
