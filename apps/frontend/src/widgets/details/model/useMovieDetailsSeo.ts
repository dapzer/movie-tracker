import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { defineMovie, getProxiedImageUrl, useI18n, useSchemaOrg, useSeoMeta } from "#imports";
import { generateApiUrl, getMovieDirectors } from "@movie-tracker/utils";
import { useLocalePath } from "#i18n";
import { computed } from "vue";

interface Args {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
  media?: TmdbMediaDetailsType | null;
  credits?: TmdbCreditsType | null;
  withoutSchema?: boolean;
  getDescription?: (overview: string | unknown) => string;
  getTitle?: (title: string, titleChink: string | undefined) => string;
}

export const useMovieDetailsSeo = (args: Args) => {
  const { mediaId, mediaType, media, credits, getDescription, getTitle, withoutSchema } = args;
  const { t } = useI18n();
  const localePath = useLocalePath();
  const getOgApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

  const title = computed(() => {
    return media?.title || media?.name || media?.original_title || media?.original_name || "";
  });

  const originalTitle = computed(() => {
    return media?.original_title || media?.original_name || "";
  });

  const ogImage = computed(() => {
    return getOgApiUrl(`/open-graph-image`, {
      title: getTitle?.(title.value, undefined) ?? title.value,
      imageUrl: media?.poster_path ? getProxiedImageUrl(media?.poster_path, undefined, true) : undefined
    });
  });

  useSeoMeta({
    titleTemplate(titleChunk) {
      return getTitle?.(title.value, titleChunk) ?? `${title.value} | ${t(`details.mediaType.${mediaType}`)} | ${titleChunk}`;
    },
    ogTitle() {
      return getTitle?.(title.value, "%s") ??  `%s | ${title.value}`;
    },
    description: getDescription?.(media?.overview) ?? media?.overview ?? t("seo.description"),
    ogDescription: getDescription?.(media?.overview) ?? media?.overview ?? t("seo.description"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImage: ogImage.value,
    twitterImage: ogImage.value,
    twitterCard: "summary_large_image",
    twitterTitle: getTitle?.(title.value, "%s") ?? `%s | ${title.value}`,
    twitterDescription: getDescription?.(media?.overview) ?? media?.overview ?? t("seo.description")
  });

  if (!withoutSchema) {
    useSchemaOrg([
      defineMovie({
        name: title.value || "",
        alternativeHeadline: originalTitle.value,
        alternativeName: originalTitle.value,
        dateCreated: media?.release_date || media?.first_air_date,
        description: media?.overview,
        url: localePath(`/details/${mediaType}/${mediaId}`),
        image: getProxiedImageUrl(media?.poster_path),
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
      }),
    ]);
  }
};

