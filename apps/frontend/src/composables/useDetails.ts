import { useMutation } from "@tanstack/vue-query";
import { initializeDetailsGenerationApi } from "~/api/detailsApi";
import { DetailsQueryKeys } from "~/constants/queryKeys";

export const useInitializeDetailsGenerationApi = () => {
  return useMutation({
    mutationKey: [DetailsQueryKeys.INITIALIZE],
    mutationFn: () => initializeDetailsGenerationApi()
  })
}
