export interface TmdbPersonType {
  adult: boolean
  also_known_as: string[]
  biography: string
  birthday: string
  deathday?: any
  gender: number
  homepage: string
  id: number
  imdb_id: string
  known_for_department: string
  name: string
  place_of_birth: string
  popularity: number
  profile_path: string
}

export interface TmdbPersonCastType {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  character: string
  credit_id: string
  order: number
  media_type: string
  origin_country: string[]
  original_name: string
  first_air_date: string
  name: string
  episode_count?: number
}

export interface TmdbPersonCrewType {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  credit_id: string
  department: string
  job: string
  media_type: string
  origin_country: string[]
  original_name: string
  first_air_date: string
  name: string
  episode_count?: number
}

export interface TmdbPersonCreditsType {
  cast: TmdbPersonCastType[]
  crew: TmdbPersonCrewType[]
  id: number
}

export interface TmdbPersonExternalIdsType {
  id: 1190668
  freebase_mid: string | null
  freebase_id: string | null
  imdb_id: string | null
  tvrage_id: string | null
  wikidata_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  tiktok_id: string | null
  twitter_id: string | null
  youtube_id: string | null
}
