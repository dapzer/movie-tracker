import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { defineBreadcrumb, defineMovie, getProxiedImageUrl, useI18n, useSchemaOrg, useSeoMeta } from "#imports";
import { generateApiUrl, getMovieDirectors } from "@movie-tracker/utils";
import { useLocalePath } from "#i18n";
import { computed } from "vue";

export const useMovieDetailsSeo = (mediaId: number, mediaType: TmdbMediaTypeEnum, media?: TmdbMediaDetailsType | null, credits?: TmdbCreditsType | null) => {
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
      title: title.value,
      imageUrl: getProxiedImageUrl(media?.poster_path, undefined, true)
    });
  });

  useSeoMeta({
    titleTemplate(titleChunk) {
      return `${titleChunk} | ${title.value}`;
    },
    ogTitle() {
      return `%s | ${title.value}`;
    },
    description: media?.overview || t("seo.description"),
    ogDescription: media?.overview || t("seo.description"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImage: ogImage.value,
    twitterImage: ogImage.value,
    twitterCard: "summary_large_image",
    twitterTitle: `%s | ${title.value}`,
    twitterDescription: media?.overview || t("seo.description")
  });

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
    ...(!!media?.number_of_seasons ? [defineBreadcrumb({
      itemListElement: [
        { name: t("details.episodesList"), href: localePath(`/details/${mediaType}/${mediaId}/seasons`) }
      ]
    })] : [])
  ]);

};
