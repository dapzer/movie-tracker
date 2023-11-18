import { ContentNames } from '@/types/Enums';
import { toast } from 'react-toastify';
import { generateApiUrl } from '@/utils/generateApiUrl';
import { SearchResponse } from '@/types/SearchResponse';
import { Person } from '@/types/Person';
import { Details } from '@/types/Details';
import { Videos } from '@/types/Videos';
import { Credits } from '@/types/Credits';
import { Queries } from '@/types/Queries';
import { SeasonDetails } from '@/types/SeasonDetails';

const getApiUrl = generateApiUrl(process.env.NEXT_PUBLIC_API_URL || '', {
  api_key: process.env.NEXT_PUBLIC_API_KEY || '',
});

export const getResponse = async <T = unknown>(url: string): Promise<T | null> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/proxy?url=${encodeURIComponent(url)}`);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    toast.warning(`An error occurred while getting data from TMDB. Code: ${data.code}`);
    return null;
  }
};

export const searchApi = async (queries: Queries.Search) => {
  if (queries.searchValue.length === 0) return null;

  const url = getApiUrl('/search/multi', {
    query: queries.searchValue,
    page: queries.page,
    language: queries.language,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const detailApi = async <T = Details.RootObject>(queries: Queries.RootObject) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
    language: queries.language,
  });

  return await getResponse<T>(url);
};

export const creditsApi = async (queries: Queries.RootObject) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/${queries.mediaType === ContentNames.Series ? 'aggregate_credits' : 'credits'}`, {
    language: queries.language,
  });

  return await getResponse<Credits.RootObject>(url);
};

export const personCreditsApi = async (queries: Queries.PersonCredits) => {
  const url = getApiUrl(`/person/${queries.personId}/combined_credits`, {
    language: queries.language,
  });

  return await getResponse<Person.Credits>(url);
};

export const trendsApi = async (queries: Queries.Trends) => {
  const url = getApiUrl(`/${queries.mediaType}/popular`, {
    language: queries.language,
    page: 1,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const recommendationsApi = async (queries: Queries.RootObject) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/recommendations`, {
    language: queries.language,
    page: 1,
  });

  return await getResponse<SearchResponse.RootObject>(url);
};

export const videosApi = async (queries: Queries.RootObject) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/videos`, {
    language: queries.language,
  });

  return await getResponse<Videos.RootObject>(url);
};

export const seasonsApi = async (queries: Queries.Seasons): Promise<SeasonDetails.RootObjectWithDetails | null> => {
  let details = {} as Details.RootObject;
  const result: SeasonDetails.RootObject[] = [];

  const maxSeasonsInRequest = 20;
  let cursor = 0;

  while (true) {
    const start = cursor * maxSeasonsInRequest;
    const end = Math.min(start + maxSeasonsInRequest);

    const seasonQuery = Array.from({ length: maxSeasonsInRequest }, (_, index) => `season/${start + index + 1}`);

    const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
      language: queries.language,
      append_to_response: seasonQuery.join(','),
    });
    const res = await getResponse<Details.RootObject>(url);

    if (res) {
      const seasons: SeasonDetails.RootObject[] = [];

      for (let j = start; j <= end; j++) {
        const seasonTitle: Details.SeasonKey = `season/${j}`;

        if (seasonTitle in res) {
          seasons.push(res[seasonTitle] as SeasonDetails.RootObject);

          if (cursor === 0) {
            delete res[seasonTitle];
          }
        }
      }

      if (cursor === 0) {
        details = res;
      }

      result.push(...seasons);
    } else {
      return null;
    }

    if (details && end >= details.number_of_seasons) break;
    cursor++;
  }

  return {
    details,
    seasons: result,
  };
};
