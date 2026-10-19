<script setup lang="ts">
import type { MediaItemTrackingDataType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useUpdateTrackingDataApi } from "~/api/trackingData/useTrackingDataApi"
import { UiSelect } from "~/shared/ui/UiSelect"

interface MediaCardManagementMenuStatusProps {
  trackingData: MediaItemTrackingDataType
  currentStatus: MediaItemStatusNameEnum
}

const props = defineProps<MediaCardManagementMenuStatusProps>()
const { t } = useI18n()

const currentStatus = ref(props.currentStatus)
const updateTrackingDataApi = useUpdateTrackingDataApi()

async function handleChangeStatus() {
  await updateTrackingDataApi.mutateAsync({
    trackingDataId: props.trackingData.id,
    body: {
      // TODO: remove this spread
      ...props.trackingData,
      currentStatus: currentStatus.value,
    },
  }).then(() => {
    toast.success(t("toasts.mediaItem.successStatusChanged"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyStatusChanged"))
  })
}

const options = computed(() => {
  const result = []

  for (const status in MediaItemStatusNameEnum) {
    result.push({
      label: t(`mediaItem.status.${status}`),
      value: status,
    })
  }

  return result
})
</script>

<template>
  <UiSelect
    v-model="currentStatus"
    :disabled="updateTrackingDataApi.isPending.value"
    :options="options"
    @update:model-value="handleChangeStatus"
  />
</template>

<style scoped lang="scss">

</style>
