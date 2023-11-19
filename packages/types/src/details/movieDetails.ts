export interface MediaDetailsRootObjectType {
  adult: boolean;
  backdrop_path: string;
  created_by: MediaDetailsCreatedByType[];
  biography: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: MediaDetailsGenreType[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: MediaDetailsLastEpisodeToAirType;
  name: string;
  next_episode_to_air?: MediaDetailsNextEpisodeToAirType;
  networks: MediaDetailsNetworkType[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: MediaDetailsProductionCompanyType[];
  production_countries: MediaDetailsProductionCountryType[];
  seasons: MediaDetailsSeasonType[];
  spoken_languages: MediaDetailsSpokenLanguageType[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  /* Movie only */
  video: boolean;
  title: string;
  runtime: number;
  revenue: number;
  release_date: string;
  original_title: string;
  imdb_id: string;
  budget: number;
}

export interface MediaDetailsCreatedByType {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface MediaDetailsGenreType {
  id: number;
  name: string;
}

export interface MediaDetailsLastEpisodeToAirType {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface MediaDetailsNextEpisodeToAirType {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime?: any;
  season_number: number;
  show_id: number;
  still_path?: any;
  vote_average: number;
  vote_count: number;
}

export interface MediaDetailsNetworkType {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface MediaDetailsProductionCompanyType {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface MediaDetailsProductionCountryType {
  iso_3166_1: string;
  name: string;
}

export interface MediaDetailsSeasonType {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface MediaDetailsSpokenLanguageType {
  english_name: string;
  iso_639_1: string;
  name: string;
}
