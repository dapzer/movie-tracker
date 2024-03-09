import { generateApiUrl } from "@movie-tracker/utils";
import type {
  TmdbCreditsType,
  TmdbMediaDetailsSeasonKey,
  TmdbMediaDetailsType,
  TmdbPersonCreditsType,
  TmdbSearchResponseType,
  TmdbSeasonDetailsType,
  TmdbVideosType,
  TmdbPersonExternalIdsType
} from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import type {
  TmdbDefaultQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbSearchQueriesType,
  TmdbSeasonsQueriesType,
  TmdbTrendsQueriesType
} from "~/types/tmdbApiQueriesTypes";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const getResponse = async <T = unknown>(path: string, queries?: Record<string, string | number>): Promise<T | null> => {
  const response = await fetch(getApiUrl(`/proxy/content${path}`, queries));
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return null;
  }
};

export const tmdbSearchApi = async (queries: TmdbSearchQueriesType) => {
  if (queries.searchValue.length === 0) return null;

  return getResponse<TmdbSearchResponseType>("/search/multi", {
    query: queries.searchValue,
    page: queries.page,
    language: queries.language
  });
};

export const tmdbDetailApi = async <T = TmdbMediaDetailsType>(queries: TmdbDefaultQueriesType) => {
  return getResponse<T>(`/${queries.mediaType}/${queries.mediaId}`, {
    language: queries.language,
  });
};

export const tmdbCreditsApi = async (queries: TmdbDefaultQueriesType) => {
  return getResponse<TmdbCreditsType>(`/${queries.mediaType}/${queries.mediaId}/${queries.mediaType === TmdbMediaTypeEnum.TV ? "aggregate_credits" : "credits"}`, {
    language: queries.language
  });
};

export const tmdbPersonCreditsApi = async (queries: TmdbPersonCreditsQueriesType) => {
  return getResponse<TmdbPersonCreditsType>(`/person/${queries.personId}/combined_credits`, {
    language: queries.language
  });
};

export const tmdbPersonExternalIdsApi = async (queries: TmdbDefaultQueriesType) => {
  return getResponse<TmdbPersonExternalIdsType>(`/${queries.mediaType}/${queries.mediaId}/external_ids`, {
    language: queries.language
  });
};


export const tmdbTrendsApi = async (queries: TmdbTrendsQueriesType) => {
  return getResponse<TmdbSearchResponseType>(`/${queries.mediaType}/popular`, {
    language: queries.language,
    page: 1
  });
};

export const tmdbRecommendationsApi = async (queries: TmdbDefaultQueriesType) => {
  return getResponse<TmdbSearchResponseType>(`/${queries.mediaType}/${queries.mediaId}/recommendations`, {
    language: queries.language,
    page: 1
  });
};

export const tmdbVideosApi = async (queries: TmdbDefaultQueriesType) => {
  return getResponse<TmdbVideosType>(`/${queries.mediaType}/${queries.mediaId}/videos`, {
    language: queries.language
  });
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

    const res = await getResponse<TmdbMediaDetailsType>(`/${queries.mediaType}/${queries.mediaId}`, {
      language: queries.language,
      append_to_response: seasonQuery.join(",")
    });

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
