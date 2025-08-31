import { useMutation } from "@tanstack/vue-query"
import { initializeDetailsGenerationApi } from "~/api/details/detailsApi"
import { DetailsQueryKeys } from "~/api/details/detailsApiQueryKeys"

export function useInitializeDetailsGenerationApi() {
  return useMutation({
    mutationKey: [DetailsQueryKeys.INITIALIZE],
    mutationFn: () => initializeDetailsGenerationApi(),
  })
}
