export const generateApiUrl = (url: string, defaultQueries?: Record<string, string>) => {
  return (path: string,queries: Record<string, string | number>) => {
    const apiUrl = new URL(url + path)

    Object.entries({...queries, ...defaultQueries}).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, value.toString())
    })

    return apiUrl.href
  }
}
