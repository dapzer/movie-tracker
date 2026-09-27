import type { MediaListType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum as StatusEnum } from "@movie-tracker/types"
import { computed } from "vue"

export type DataImportProcessingListMode = "new" | "existing"

export function useDataImportProcessingOptions(
  mediaLists?: MediaListType[],
) {
  const { t } = useI18n()

  const listModeOptions = computed(() => [
    { label: t("dataImport.processing.newList"), value: "new" },
    { label: t("dataImport.processing.existingList"), value: "existing" },
  ])

  const mediaListOptions = computed(() => {
    return (mediaLists ?? []).map(list => ({
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
