import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";

export const getTmdbImageUrl = (path?: string) => {
  if (!path) {
    return "/defaultPoster.svg";
  }

  return getProxiedImageUrl(`https://image.tmdb.org/t/p/original${path}`);
};
