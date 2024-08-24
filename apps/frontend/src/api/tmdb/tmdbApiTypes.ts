type Language = string;
type SearchValue = string;
type Page = number;
type MediaType = string;
type MediaId = number;

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
}

export type TmdbSeasonsQueriesType = TmdbDefaultQueriesType

export interface TmdbDefaultQueriesType {
  language: Language;
  mediaType: MediaType;
  mediaId: MediaId;
}
