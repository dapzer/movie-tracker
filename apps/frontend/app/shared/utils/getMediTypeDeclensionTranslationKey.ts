import type { TmdbMediaTypeEnum } from "@movie-tracker/types"

export function getMediaTypeDeclensionTranslationKey(count: number, mediaType: TmdbMediaTypeEnum) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  const capitalizedMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `details.multiple${capitalizedMediaType}`
  }

  switch (lastDigit) {
    case 1:
      return `details.single${capitalizedMediaType}`
    case 2:
    case 3:
    case 4:
      return `details.multiple${capitalizedMediaType}`
    default:
      return `details.multiple${capitalizedMediaType}`
  }
}
