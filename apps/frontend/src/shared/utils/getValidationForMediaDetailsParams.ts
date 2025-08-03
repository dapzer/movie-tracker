import type { NuxtError } from "#app"
import type { RouteLocationNormalized } from "#vue-router"
import type { TmdbMediaTypeEnum } from "@movie-tracker/types"

export function getValidationForMediaDetailsParams(allowedMediaTypes: TmdbMediaTypeEnum[]): ((route: RouteLocationNormalized) => boolean | Partial<NuxtError> | Promise<boolean | Partial<NuxtError>>) {
  return ({ params }) => {
    if (!allowedMediaTypes.some((el) => {
      const mediaType = params.mediaType
      return el === mediaType
    })) {
      return {
        statusCode: 404,
        message: "Page not found",
      }
    }
    if (Number.isNaN(Number(params.mediaId))) {
      return {
        statusCode: 404,
        message: "Page not found",
      }
    }
    return true
  }
}
