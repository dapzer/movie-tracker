import { Details } from '@/types/Details';

export module SeasonDetails {
  export interface EpisodeCrew {
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

  export interface EpisodeGuestStars {
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

  export interface Episode {
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
    crew: EpisodeCrew[];
    guest_stars: EpisodeGuestStars[];
  }

  export interface RootObject {
    _id: string;
    air_date: string;
    episodes: Episode[];
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }

  export interface RootObjectWithDetails {
    details: Details.RootObject;
    seasons: RootObject[];
  }
}
