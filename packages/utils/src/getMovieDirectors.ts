import type { TmdbCreditsCrewType } from "@movie-tracker/types"

export function getMovieDirectors(array: TmdbCreditsCrewType[]) {
  return array.filter(el => el.job === "Director")
}
