import type { MediaItemType, MediaDetailsType } from "@movie-tracker/types";

export const getCurrentMediaDetails = (mediaItem: MediaItemType, locale: string) => {
  return mediaItem.mediaDetails?.[locale as keyof Pick<MediaDetailsType, "ru" | "en">];
}
