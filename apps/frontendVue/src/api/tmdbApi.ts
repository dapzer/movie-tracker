import { generateApiUrl } from "@movie-tracker/utils";
import type {
  TmdbCreditsType,
  TmdbMediaDetailsType,  TmdbPersonCreditsType,
  TmdbSearchResponseType, TmdbSeasonDetailsType, TmdbSeasonDetailsWithMediaDetailsType, TmdbVideosType,
  TmdbMediaDetailsSeasonKey
} from "@movie-tracker/types";
import type {
  TmdbDefaultQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbSearchQueriesType, TmdbSeasonsQueriesType, TmdbTrendsQueriesType
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
  // const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}/${queries.mediaType === MediaTypeEnum.TV ? "aggregate_credits" : "credits"}`, {
  //   language: queries.language
  // });

  return await getResponse<TmdbCreditsType>("url");
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

export const tmdbSeasonsApi = async (queries: TmdbSeasonsQueriesType): Promise<TmdbSeasonDetailsWithMediaDetailsType | null> => {
  let details = {} as TmdbMediaDetailsType;
  const result: TmdbSeasonDetailsType[] = [];

  const maxSeasonsInRequest = 20;
  let cursor = 0;

  while (true) {
    const start = cursor * maxSeasonsInRequest;
    const end = Math.min(start + maxSeasonsInRequest);

    const seasonQuery = Array.from({ length: maxSeasonsInRequest }, (_, index) => `season/${start + index + 1}`);

    const url = getApiUrl(`/${queries.mediaType}/${queries.mediaId}`, {
      language: queries.language,
      append_to_response: seasonQuery.join(",")
    });
    const res = await getResponse<TmdbMediaDetailsType>(url);

    if (res) {
      const seasons: TmdbSeasonDetailsType[] = [];

      for (let j = start; j <= end; j++) {
        const seasonTitle: TmdbMediaDetailsSeasonKey = `season/${j}`;

        if (seasonTitle in res) {
          seasons.push(res[seasonTitle] as TmdbSeasonDetailsType);

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
    seasons: result
  };
};
