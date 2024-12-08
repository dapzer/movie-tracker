type Language = string;
type SearchValue = string;
type Page = number;
type MediaType = string;
type MediaId = number;
type Region = string;

export interface TmdbSearchQueriesType {
  language: Language;
  searchValue: SearchValue;
  page: Page;
}

export interface TmdbPersonCreditsQueriesType {
  language: Language;
  personId: MediaId;
}

export interface TmdbPopularQueriesType {
  language: Language;
  mediaType: MediaType;
  timeWindow?: string;
  page: Page;
}

export interface TmdbUpcomingMoviesQueriesType {
  language: Language;
  page: Page;
  region?: Region
}

export interface TmdbTvOnTheAirQueriesType {
  language: Language;
  page: Page;
}

export interface TmdbTvAiringTodayQueriesType {
  language: Language;
  page: Page;
}

export interface TmdbDiscoverMovieQueriesType {
  language: Language;
  page: Page;
  sort_by?: "original_title.desc" | "original_title.asc" | "popularity.asc" | "popularity.desc" | "revenue.asc" | "revenue.desc" | "primary_release_date.asc" | "title.asc" | "title.desc" | "primary_release_date.desc" | "vote_average.asc" | "vote_average.desc" | "vote_count.asc" | "vote_count.desc"
  certification_country?: string
  certification?: string
  "certification.lte"?: string
  "certification.gte"?: string
  include_adult?: false
  include_video?: false
  primary_release_year?: number
  "primary_release_date.gte"?: string
  "primary_release_date.lte"?: string
  "release_date.gte"?: string
  "release_date.lte"?: string
  with_release_type?: number
  year?: number
  "vote_count.gte"?: number
  "vote_count.lte"?: number
  "vote_average.gte"?: number
  "vote_average.lte"?: number
  with_cast?: string
  with_crew?: string
  with_people?: string
  with_companies?: string
  with_genres?: number
  without_genres?: string
  with_keywords?: string
  without_keywords?: string
  "with_runtime.gte"?: number
  "with_runtime.lte"?: number
  with_original_language?: string
  with_watch_providers?: string
  watch_region?: string
  with_watch_monetization_types?: string
}

export interface TmdbDiscoverTvQueriesType {
  language: Language;
  page: Page;
  sort_by?: "first_air_date.asc" | "first_air_date.desc" | "name.asc" | "name.desc" | "original_name.asc" | "original_name.desc" | "popularity.asc" | "popularity.desc" | "vote_average.asc" | "vote_average.desc" | "vote_count.asc" | "vote_count.desc"
  "air_date.gte"?: string
  "air_date.lte"?: string
  "first_air_date.gte"?: string
  "first_air_date.lte"?: string
  first_air_date_year?: number
  timezone?: string
  "vote_average.gte"?: number
  "vote_count.gte"?: number
  with_genres?: string
  with_networks?: string
  without_genres?: string
  "with_runtime.gte"?: number
  "with_runtime.lte"?: number
  include_null_first_air_dates?: boolean
  with_original_language?: string
  without_keywords?: string
  screened_theatrically?: boolean
  with_companies?: string
  with_keywords?: string
  with_watch_providers?: string
  watch_region?: string
  with_watch_monetization_types?: string
}

export type TmdbSeasonsQueriesType = TmdbDefaultQueriesType

export type TmdbVideosQueriesType = TmdbDefaultQueriesType & {
  includeVideoLanguage?: string
}

export interface TmdbDefaultQueriesType {
  language: Language;
  mediaType: MediaType;
  mediaId: MediaId;
}
