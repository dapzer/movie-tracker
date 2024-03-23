import type { TmdbPersonType } from "@movie-tracker/types";
import { definePerson, getProxiedImageUrl, useI18n, useSchemaOrg, useSeoMeta } from "#imports";
import { useLocalePath } from "#i18n";
import { generateApiUrl } from "@movie-tracker/utils";
import { computed } from "vue";

export const usePersonDetailsSeo = (person?: TmdbPersonType | null) => {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const getOgApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

  const ogImage = computed(() => {
    return getOgApiUrl(`/openGraphImage`, {
      title: person!.name!,
      imageUrl: getProxiedImageUrl(person?.profile_path, undefined, true),
    });
  });
  useSeoMeta({
    titleTemplate(titleChunk) {
      return `${titleChunk} | ${person?.name}`;
    },
    ogTitle: `%s | ${person?.name}`,
    description: person?.biography || t("seo.description"),
    ogDescription: person?.biography || t("seo.description"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImage: ogImage.value,
    twitterImage: ogImage.value,
    twitterCard: "summary_large_image",
    twitterTitle: `%s | ${person?.name}`,
    twitterDescription: person?.biography || t("seo.description")
  });

  useSchemaOrg([
    definePerson({
      name: person?.name,
      url: localePath(`/details/person/${person?.id}`),
      description: person?.biography,
      image: getProxiedImageUrl(person?.profile_path)
    })
  ]);

};
