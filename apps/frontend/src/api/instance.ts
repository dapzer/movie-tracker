import { FetchClient } from "@movie-tracker/utils"

export const api = new FetchClient({
  baseUrl: () => (import.meta.server ? import.meta.env.VITE_API_LOCAL_URL : import.meta.env.VITE_API_URL) as string,
  options: {
    credentials: "include",
  },
})

export const contentApi = new FetchClient({
  baseUrl: () => `${import.meta.server ? import.meta.env.VITE_API_LOCAL_URL : import.meta.env.VITE_API_URL}/proxy/content`,
})
