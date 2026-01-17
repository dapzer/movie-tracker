import { FetchClient } from "@movie-tracker/utils"
import { config } from "@/shared/constants"

export const tmdbApi = new FetchClient({
  baseUrl: config.TMDB_API_URL,
  params: {
    api_key: config.TMDB_API_KEY,
  },
})
