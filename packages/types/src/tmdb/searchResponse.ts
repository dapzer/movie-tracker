export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResponseResultItem[];
  total_pages: number;
  total_results: number;
}

export interface TmdbSearchResponseResultItem {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  video: boolean;
  vote_average: number;
  profile_path?: string;
  vote_count: number;
  known_for: TmdbSearchResponseKnownFor[];
}

export interface TmdbSearchResponseKnownFor {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
