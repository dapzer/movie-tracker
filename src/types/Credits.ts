export module Credits {
  export interface Role {
    credit_id: string;
    character: string;
    episode_count: number;
  }

  export interface Cast {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    roles: Role[];
    total_episode_count: number;
    order: number;
    //  Movie
    cast_id: number;
    character: string;
    credit_id: string;
  }

  export interface Job {
    credit_id: string;
    job: string;
    episode_count: number;
  }

  export interface Crew {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    jobs?: Job[];
    department: string;
    total_episode_count: number;
    credit_id: string;
    job?: string;
  }

  export interface RootObject {
    cast: Cast[];
    crew: Crew[];
    id: number;
  }
}
