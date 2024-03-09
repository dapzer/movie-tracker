import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";

export const getTmdbImageUrl = (path?: string, size?: number, withoutProxy = false) => {
  if (!path) {
    return "/defaultPoster.svg";
  }

  if (withoutProxy) {
    return `https://image.tmdb.org/t/p/original${path}`;
  }

  return getProxiedImageUrl(`https://image.tmdb.org/t/p/original${path}`, size);
};
