import { TmdbMediaDetailsType } from "./mediaDetails";

export interface TmdbSeasonDetailsEpisodeCrewType {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface TmdbSeasonDetailsEpisodeGuestStarsType {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface TmdbSeasonDetailsEpisodeType {
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
  crew: TmdbSeasonDetailsEpisodeCrewType[];
  guest_stars: TmdbSeasonDetailsEpisodeGuestStarsType[];
}

export interface TmdbSeasonDetailsType {
  _id: string;
  air_date: string;
  episodes: TmdbSeasonDetailsEpisodeType[];
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TmdbSeasonDetailsWithMediaDetailsType {
  details: TmdbMediaDetailsType;
  seasons: TmdbSeasonDetailsType[];
}
