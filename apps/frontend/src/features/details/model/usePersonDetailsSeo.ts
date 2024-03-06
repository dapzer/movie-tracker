import type { TmdbPersonType } from "@movie-tracker/types";
import { definePerson, getTmdbImageUrl, useI18n, useSchemaOrg, useSeoMeta } from "#imports";
import { useLocalePath } from "#i18n";

export const usePersonDetailsSeo = (person?: TmdbPersonType | null) => {
  const { t } = useI18n();
  const localePath = useLocalePath();

  useSeoMeta({
    titleTemplate(titleChunk){
      return `${titleChunk} | ${person?.name}`;
    },
    ogTitle: `%s | ${person?.name}`,
    description: person?.biography || t("seo.description"),
    ogDescription: person?.biography || t("seo.description"),
  });

  useSchemaOrg([
    definePerson({
      name: person?.name,
      url: localePath(`/details/person/${person?.id}`),
      description: person?.biography,
      image: getTmdbImageUrl(person?.profile_path),
    })
  ])

}
