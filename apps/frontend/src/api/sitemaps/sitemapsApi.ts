import { api } from "~/api/instance";

export const initializeSitemapGenerationsApi = async () => {
  return api.post("sitemaps/generate");
};
