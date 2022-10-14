import { Credits } from '../types/Credits';

export const getMovieDirectors = (array: Credits.Crew[]) => {
  return array.filter((el) => el.job === 'Director');
};
