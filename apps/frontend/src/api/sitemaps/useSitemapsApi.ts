import { useMutation } from "@tanstack/vue-query"
import { SitemapQueryKeys } from "~/api/sitemaps/sitemapApiQueryKeys"
import { initializeSitemapGenerationsApi } from "~/api/sitemaps/sitemapsApi"

export function useInitializeSitemapGenerationsApi() {
  return useMutation({
    mutationKey: [SitemapQueryKeys.GENERATE],
    mutationFn: () => initializeSitemapGenerationsApi(),
  })
}
