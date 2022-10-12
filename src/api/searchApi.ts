import queryString from 'query-string';

export const searchApi = async (queries: any) => {
  const url = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_API_URL}/search/multi`,
    query: {
      api_key: process.env.NEXT_PUBLIC_API_KEY,
      query: queries.queryKey[1].searchValue,
      page: queries.queryKey[1].page,
      // language: 'en-US',
    },
  });

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return null;
  }
};
