import { generateApiUrl } from "@movie-tracker/utils";
import { fetchWihCredentials } from "~/utils/fetchWihCredentials";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const initializeSitemapGenerationsApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/sitemaps/generate"), {
    method: "POST"
  });
  const data = await response.json();

  if (response.ok) {
    return;
  }

  throw new Error(`Error when initializing sitemap. Code: ${data.statusCode}`);
}
