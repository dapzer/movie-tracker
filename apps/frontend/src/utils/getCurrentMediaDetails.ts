import type { MediaDetailsType } from "@movie-tracker/types";

export const getCurrentMediaDetails = (mediaDetails?: MediaDetailsType, locale?: string) => {
  return mediaDetails?.[locale as keyof Pick<MediaDetailsType, "ru" | "en">];
};
