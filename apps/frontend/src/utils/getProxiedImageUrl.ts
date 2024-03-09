export const getProxiedImageUrl = (url: string, size?: number) => {
  return `${import.meta.env.VITE_API_URL}/proxy/image?url=${url}${size ? `&size=${size}` : ''}`
}
