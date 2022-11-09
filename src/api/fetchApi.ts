import queryString from 'query-string';
import { ContentNames } from '../types/ContentNames';

export const getResponse = async (url: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/proxy?url=${encodeURIComponent(url)}`);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return null;
  }
};

export const searchApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  if (queriesValue.searchValue.length === 0) return null;

  const url = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_API_URL}/search/multi`,
    query: {
      api_key: process.env.NEXT_PUBLIC_API_KEY,
      query: queriesValue.searchValue,
      page: queriesValue.page,
      language: queriesValue.language,
    },
  });

  return await getResponse(url);
};

export const detailApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];
  const url = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_API_URL}/${queriesValue.mediaType}/${queriesValue.mediaId}`,
    query: {
      api_key: process.env.NEXT_PUBLIC_API_KEY,
      language: queriesValue.language,
    },
  });

  return await getResponse(url);
};

export const creditsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];
  const url = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_API_URL}/${queriesValue.mediaType}/${queriesValue.mediaId}/${
      queriesValue.mediaType === ContentNames.Series ? 'aggregate_credits' : 'credits'
    }`,
    query: {
      api_key: process.env.NEXT_PUBLIC_API_KEY,
    },
  });

  return await getResponse(url);
};

export const personCreditsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];
  const url = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_API_URL}/person/${queriesValue.person_id}/combined_credits`,
    query: {
      api_key: process.env.NEXT_PUBLIC_API_KEY,
      language: queriesValue.language,
    },
  });

  return await getResponse(url);
};
