import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { defineMovie, getTmdbImageUrl, useI18n, useSchemaOrg, useSeoMeta } from "#imports";
import { getMovieDirectors } from "@movie-tracker/utils";
import { useLocalePath } from "#i18n";

export const useMovieDetailsSeo = (mediaId: number, mediaType: TmdbMediaTypeEnum, media?: TmdbMediaDetailsType | null, credits?: TmdbCreditsType | null) => {
  const { t } = useI18n();
  const localePath = useLocalePath();

  useSeoMeta({
    titleTemplate(titleChunk) {
      return `${titleChunk} | ${media?.title || media?.name || media?.original_title || media?.original_name}`;
    },
    ogTitle() {
      return `%s | ${media?.title || media?.name || media?.original_title || media?.original_name}`;
    },
    description: media?.overview || t("seo.description"),
    ogDescription: media?.overview || t("seo.description")
  });

  useSchemaOrg([
    defineMovie({
      name: media?.title || media?.name || media?.original_title || media?.original_name || "",
      alternativeHeadline: media?.original_title || media?.original_name || "",
      alternativeName: media?.original_title || media?.original_name || "",
      dateCreated: media?.release_date || media?.first_air_date,
      description: media?.overview,
      url: localePath(`/details/${mediaType}/${mediaId}`),
      image: getTmdbImageUrl(media?.poster_path),
      director: [
        ...getMovieDirectors(credits?.crew || []),
        ...(media?.created_by || [])
      ].map((el) => {
        return {
          name: el.name,
          url: localePath(`/details/person/${el.id}`)
        };
      }),
      actor: (credits?.cast || []).map((el) => {
        return {
          name: el.name,
          url: localePath(`/details/person/${el.id}`)
        };
      }),
      ...(media?.vote_count && {
        aggregateRating: {
          ratingValue: media?.vote_average || 0,
          bestRating: 10,
          ratingCount: media?.vote_count || 0
        }
      })
    })
  ]);

};
