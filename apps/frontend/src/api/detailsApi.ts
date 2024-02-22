import { generateApiUrl } from "@movie-tracker/utils";
import { fetchWihCredentials } from "~/utils/fetchWihCredentials";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const initializeDetailsGenerationApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/mediaDetails"));
  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(`Error when initializing details generation. Code: ${data.statusCode}`);
}
