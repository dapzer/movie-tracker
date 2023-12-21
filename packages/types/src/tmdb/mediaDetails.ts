export interface TmdbMediaDetailsType {
  adult: boolean;
  backdrop_path: string;
  created_by: TmdbMediaDetailsCreatedByType[];
  biography: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: TmdbMediaDetailsGenreType[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TmdbMediaDetailsLastEpisodeToAirType;
  name: string;
  next_episode_to_air?: TmdbMediaDetailsNextEpisodeToAirType;
  networks: TmdbMediaDetailsNetworkType[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TmdbMediaDetailsProductionCompanyType[];
  production_countries: TmdbMediaDetailsProductionCountryType[];
  seasons: TmdbMediaDetailsSeasonType[];
  spoken_languages: TmdbMediaDetailsSpokenLanguageType[];
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

export interface TmdbMediaDetailsCreatedByType {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface TmdbMediaDetailsGenreType {
  id: number;
  name: string;
}

export interface TmdbMediaDetailsLastEpisodeToAirType {
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

export interface TmdbMediaDetailsNextEpisodeToAirType {
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

export interface TmdbMediaDetailsNetworkType {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface TmdbMediaDetailsProductionCompanyType {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TmdbMediaDetailsProductionCountryType {
  iso_3166_1: string;
  name: string;
}

export interface TmdbMediaDetailsSeasonType {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface TmdbMediaDetailsSpokenLanguageType {
  english_name: string;
  iso_639_1: string;
  name: string;
}
