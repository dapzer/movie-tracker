import type { MediaDetailsType } from "@movie-tracker/types"

export function getCurrentMediaDetails(mediaDetails?: MediaDetailsType, locale?: string) {
  return mediaDetails?.[locale as keyof Pick<MediaDetailsType, "ru" | "en">]
}
