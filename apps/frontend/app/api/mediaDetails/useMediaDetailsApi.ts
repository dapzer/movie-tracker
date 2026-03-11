import { useMutation } from "@tanstack/vue-query"
import { initializeDetailsGenerationApi } from "~/api/mediaDetails/mediaDetailsApi"
import { MediaDetailsQueryKeys } from "~/api/mediaDetails/mediaDetailsApiQueryKeys"

export function useInitializeDetailsGenerationApi() {
  return useMutation({
    mutationKey: [MediaDetailsQueryKeys.INITIALIZE],
    mutationFn: () => initializeDetailsGenerationApi(),
  })
}
