import { generateApiUrl } from "@movie-tracker/utils"

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "")

export function getProxiedImageUrl(path?: string | null, size?: number, keepOriginalType?: boolean) {
  return getApiUrl(`/proxy/image${path}`, {
    size,
    keepOriginalType,
  })
}
