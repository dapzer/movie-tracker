import type { MediaListType } from "@movie-tracker/types"
import type { Ref } from "vue"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum as StatusEnum } from "@movie-tracker/types"
import { computed } from "vue"

export type DataImportProcessingListMode = "new" | "existing"

export function useDataImportProcessingOptions(
  mediaLists: Ref<MediaListType[] | undefined>,
) {
  const { t } = useI18n()

  const listModeOptions = computed(() => [
    { label: t("dataImport.processing.newList"), value: "new" as const },
    { label: t("dataImport.processing.existingList"), value: "existing" as const },
  ])

  const mediaListOptions = computed(() => {
    return (mediaLists.value ?? []).map(list => ({
      value: list.id,
      label: list.title ?? t("mediaList.favorites"),
    }))
  })

  const statusOptions = computed(() => {
    return Object.values(StatusEnum).map(value => ({
      value,
      label: t(`mediaItem.status.${value}`),
    }))
  })

  return {
    listModeOptions,
    mediaListOptions,
    statusOptions,
  }
}
