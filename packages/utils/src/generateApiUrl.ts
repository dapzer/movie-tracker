export function generateApiUrl(baseUrl: string, defaultQueries?: Record<string, string>) {
  return (path: string, queries?: Record<string, string | number | boolean | undefined>) => {
    const apiUrl = new URL(baseUrl + path)
    const fullQueries = { ...defaultQueries, ...queries }

    for (const key in fullQueries) {
      const queryValue = fullQueries[key]
      if (!queryValue)
        continue
      apiUrl.searchParams.append(key, queryValue.toString())
    }

    return apiUrl.href
  }
}
