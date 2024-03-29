import { generateApiUrl } from "@movie-tracker/utils";

const getApiUrl= generateApiUrl(import.meta.env.VITE_API_URL || '')

export const getProxiedImageUrl = (path?: string, size?: number, keepOriginalType?: boolean) => {
  if (!path) {
    return "/defaultPoster.svg";
  }

  return getApiUrl(`/proxy/image${path}`, {
    size: size,
    keepOriginalType: keepOriginalType,
  })
}
