export const getProxiedImageUrl = (url: string) => {
  return `${import.meta.env.VITE_API_URL}/proxy/image?url=${url}`
}
