export interface TmdbCreditsRoleType {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface TmdbCreditsCastType {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: TmdbCreditsRoleType[];
  total_episode_count: number;
  order: number;
  //  Movie
  cast_id: number;
  character: string;
  credit_id: string;
}

export interface TmdbCreditsJobType {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface TmdbCreditsCrewType {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  jobs?: TmdbCreditsJobType[];
  department: string;
  total_episode_count: number;
  credit_id: string;
  job?: string;
}

export interface TmdbCreditsType {
  cast: TmdbCreditsCastType[];
  crew: TmdbCreditsCrewType[];
  id: number;
}
