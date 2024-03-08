import { generateApiUrl } from "@movie-tracker/utils";
import type {
  TmdbCreditsType,
  TmdbMediaDetailsSeasonKey,
  TmdbMediaDetailsType,
  TmdbPersonCreditsType,
  TmdbSearchResponseType,
  TmdbSeasonDetailsType,
  TmdbVideosType
} from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import type {
  TmdbDefaultQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbSearchQueriesType,
  TmdbSeasonsQueriesType,
  TmdbTrendsQueriesType
} from "~/types/tmdbApiQueriesTypes";

const getApiUrl = generateApiUrl(import.meta.env.VITE_TMDB_API_URL || "", {
  api_key: import.meta.env.VITE_TMDB_API_KEY || ""
});

export const getResponse = async <T = unknown>(url: string): Promise<T | null> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(url)}`);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return null;
  }
};

export const tmdbSearchApi = async (queries: TmdbSearchQueriesType) => {
  if (queries.searchValue.length === 0) return null;

  const url = getApiUrl("/search/multi", {
    query: queries.searchValue,
    page: queries.page,
    language: queries.language
  });

  return await getResponse<TmdbSearchResponseType>(url);
};

export const tmdbDetailApi = async <T = TmdbMediaDetailsType>(queries: TmdbDefaultQueriesType) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
    language: queries.language
  });

  return await getResponse<T>(url);
};

export const tmdbCreditsApi = async (queries: TmdbDefaultQueriesType) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/${queries.mediaType === TmdbMediaTypeEnum.TV ? "aggregate_credits" : "credits"}`, {
    language: queries.language
  });

  return await getResponse<TmdbCreditsType>(url);
};

export const tmdbPersonCreditsApi = async (queries: TmdbPersonCreditsQueriesType) => {
  const url = getApiUrl(`/person/${queries.personId}/combined_credits`, {
    language: queries.language
  });

  return await getResponse<TmdbPersonCreditsType>(url);
};

export const tmdbTrendsApi = async (queries: TmdbTrendsQueriesType) => {
  const url = getApiUrl(`/${queries.mediaType}/popular`, {
    language: queries.language,
    page: 1
  });

  return await getResponse<TmdbSearchResponseType>(url);
};

export const tmdbRecommendationsApi = async (queries: TmdbDefaultQueriesType) => {
  const url
    = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/recommendations`, {
    language: queries.language,
    page: 1
  });

  return await getResponse<TmdbSearchResponseType>(url);
};

export const tmdbVideosApi = async (queries: TmdbDefaultQueriesType) => {
  const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/videos`, {
    language: queries.language
  });

  return await getResponse<TmdbVideosType>(url);
};

export const tmdbSeasonsApi = async (queries: TmdbSeasonsQueriesType): Promise<TmdbSeasonDetailsType[] | null> => {
  let details = {} as TmdbMediaDetailsType;
  const seasons: TmdbSeasonDetailsType[] = [];

  const maxSeasonsInRequest = 20;
  let cursor = 0;

  while (true) {
    const start = cursor * maxSeasonsInRequest;
    const end = start + maxSeasonsInRequest;

    const seasonQuery = Array.from({ length: maxSeasonsInRequest }, (_, index) => `season/${start + index}`);

    const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
      language: queries.language,
      append_to_response: seasonQuery.join(",")
    });
    const res = await getResponse<TmdbMediaDetailsType>(url);

    if (res) {
      for (let j = start; j <= end; j++) {
        const seasonKey: TmdbMediaDetailsSeasonKey = `season/${j}`;

        if (seasonKey in res) {
          seasons.push(res[seasonKey] as TmdbSeasonDetailsType);
        }
      }

      if (cursor === 0) {
        details = res;
      }
    } else {
      return null;
    }

    if (details && end >= details.number_of_seasons) break;
    cursor++;
  }

  return seasons;
};
