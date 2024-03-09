export const getProxiedImageUrl = (path?: string, size?: number) => {
  if (!path) {
    return "/defaultPoster.svg";
  }

  return `${import.meta.env.VITE_API_URL}/proxy/image${path}${size ? `?size=${size}` : ''}`
}
