import type { TmdbPersonType } from "@movie-tracker/types"
import { useI18n, useSeoMeta } from "#imports"
import { generateApiUrl } from "@movie-tracker/utils"
import { computed } from "vue"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import { getShortText } from "~/shared/utils/getShortText"

export function usePersonDetailsSeo(person?: TmdbPersonType | null) {
  const { t } = useI18n()
  const getOgApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "")

  const ogImage = computed(() => {
    return getOgApiUrl(`/open-graph-images`, {
      title: person?.name || "",
      imageUrl: person?.profile_path ? getProxiedImageUrl(person?.profile_path, undefined, true) : undefined,
      isAvatarPlaceholder: true,
    })
  })

  const description = computed(() => {
    return getShortText(person?.biography ?? t("seo.description"), 150)
  })

  useSeoMeta({
    titleTemplate(titleChunk) {
      return `${person?.name} | ${person?.known_for_department
        ? `${t(`details.department.${person?.known_for_department}`,
        )} | `
        : ""}${titleChunk}`
    },
    ogTitle: `Movie Tracker | ${person?.name}`,
    description,
    ogDescription: description,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImage: ogImage.value,
    twitterImage: ogImage.value,
    twitterCard: "summary_large_image",
    twitterTitle: `Movie Tracker | ${person?.name}`,
    twitterDescription: description,
  })
}
