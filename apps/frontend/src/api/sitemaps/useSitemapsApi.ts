import { useMutation } from "@tanstack/vue-query";
import { initializeSitemapGenerationsApi } from "~/api/sitemaps/sitemapsApi";
import { SitemapQueryKeys } from "~/api/sitemaps/sitemapApiQueryKeys";

export const useInitializeSitemapGenerationsApi = () => {
  return useMutation({
    mutationKey: [SitemapQueryKeys.GENERATE],
    mutationFn: () => initializeSitemapGenerationsApi(),
  })
}
