import { initializeSitemapGenerationsApi } from "~/api/sitemapsApi";
import { useMutation } from "@tanstack/vue-query";
import { SitemapQueryKeys } from "~/constants/queryKeys";

export const useInitializeSitemapGenerationsApi = () => {
  return useMutation({
    mutationKey: [SitemapQueryKeys.GENERATE],
    mutationFn: () => initializeSitemapGenerationsApi(),
  })
}
