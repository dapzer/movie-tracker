import { TmdbCreditsCrewType } from "@movie-tracker/types";

export const getMovieDirectors = (array: TmdbCreditsCrewType[]) => {
  return array.filter((el) => el.job === 'Director');
};
