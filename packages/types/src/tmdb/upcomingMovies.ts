import { TmdbSearchResponseType } from "./searchResponse"

export interface TmdbUpcomingMoviesResponseType extends TmdbSearchResponseType {
  dates: TmdbUpcomingMoviesDatesType
}

export interface TmdbUpcomingMoviesDatesType {
  maximum: string
  minimum: string
}
