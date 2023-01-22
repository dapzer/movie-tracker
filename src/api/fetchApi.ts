import { ContentNames } from '@/types/Enums';
import { toast } from 'react-toastify';
import { generateApiUrl } from '@/utils/generateApiUrl';
import { SearchResponse } from '@/types/SearchResponse';
import { Person } from '@/types/Person';
import { Details } from '@/types/Details';
import { Videos } from '@/types/Videos';
import { Credits } from '@/types/Credits';

const getApiUrl = generateApiUrl(process.env.NEXT_PUBLIC_API_URL || '', {
  api_key: process.env.NEXT_PUBLIC_API_KEY || '',
});

export const getResponse = async <T = any>(url: string): Promise<T | null> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/proxy?url=${encodeURIComponent(url)}`);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    toast.warning(`An error occurred while getting data from TMDB. Code: ${data.code}`);
    return null;
  }
};

export const searchApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  if (queriesValue.searchValue.length === 0) return null;

  const url = getApiUrl('/search/multi', {
    query: queriesValue.searchValue,
    page: queriesValue.page,
    language: queriesValue.language,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const detailApi = async <T = Details.RootObject>(queries: any) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
    language: queries.language,
  });

  return await getResponse<T>(url);
};

export const creditsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  const url = getApiUrl(`/${queriesValue.mediaType}/${queriesValue.mediaId}/${
    queriesValue.mediaType === ContentNames.Series ? 'aggregate_credits' : 'credits'
  }`, {});

  return await getResponse<Credits.RootObject>(url);
};

export const personCreditsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  const url = getApiUrl(`/person/${queriesValue.person_id}/combined_credits`, {
    language: queriesValue.language,
  });

  return await getResponse<Person.Credits>(url);
};

export const trendsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  const url = getApiUrl(`/${queriesValue.mediaType}/popular`, {
    language: queriesValue.language,
    page: 1,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const recommendationsApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  const url = getApiUrl(`/${queriesValue.mediaType}/${queriesValue.mediaId}/recommendations`, {
    language: queriesValue.language,
    page: 1,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const videosApi = async (queries: any) => {
  const queriesValue = queries.queryKey[1];

  const url = getApiUrl(`/${queriesValue.mediaType}/${queriesValue.mediaId}/videos`, {
    language: queriesValue.language,
  });

  return await getResponse<Videos.RootObject>(url);
};
