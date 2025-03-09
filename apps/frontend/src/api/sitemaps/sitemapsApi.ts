import { api } from "~/api/instance"

export async function initializeSitemapGenerationsApi() {
  return api.post("sitemaps/generate")
}
