export const generateApiUrl = (
  baseUrl: string,
  defaultQueries?: Record<string, string>
) => {
  return (path: string, queries?: Record<string, string | number | boolean>) => {
    const apiUrl = new URL(baseUrl + path);
    const fullQueries = { ...defaultQueries, ...queries };

    for (const key in fullQueries) {
      apiUrl.searchParams.append(key, fullQueries[key].toString());
    }

    return apiUrl.href;
  };
};
