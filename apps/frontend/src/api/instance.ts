import { FetchClient } from "@movie-tracker/utils"

export const api = new FetchClient({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    credentials: "include",
  },
})

export const contentApi = new FetchClient({
  baseUrl: `${import.meta.env.VITE_API_URL}/proxy/content`,
})
