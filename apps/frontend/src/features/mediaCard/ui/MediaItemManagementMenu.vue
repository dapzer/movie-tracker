<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useDeleteMediaItemApi, useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemTrackingMenu.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiSelect } from "~/shared/ui/UiSelect"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemManagementMenuDrawerProps>()
const emits = defineEmits<{
  (event: "clone"): void
  (event: "changeMediaList"): void
}>()
const { t } = useI18n()
const currentStatus = ref(props.mediaItem.trackingData.currentStatus)
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi()
const deleteMediaItemApi = useDeleteMediaItemApi()

async function handleChangeStatus() {
  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      currentStatus: currentStatus.value,
    },
  }).then(() => {
    toast.success(t("toasts.mediaItem.successStatusChanged"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyStatusChanged"))
  })
}

function handleDeleteMediaItem() {
  deleteMediaItemApi.mutateAsync(props.mediaItem.id).then(() => {
    toast.success(t("toasts.mediaItem.successRemovedFromCurrentList", {
      media: t(`details.mediaType.${props.mediaItem.mediaType}`),
    }))
  }).catch(() => {
    toast.error(t(`toasts.mediaItem.unsuccessfullyRemovedFromCurrentList${props.mediaItem.mediaType}`))
  })
}

const selectOptions = computed(() => {
  const rea = []

  for (const status in MediaItemStatusNameEnum) {
    rea.push({
      label: t(`mediaItem.status.${status}`),
      value: status,
    })
  }

  return rea
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiSelect
      v-model="currentStatus"
      :options="selectOptions"
      @update:model-value="handleChangeStatus"
    />
    <UiDivider />
    <div :class="$style.actions">
      <UiButton
        :class="$style.menuItem"
        variant="text"
        @click="emits('changeMediaList')"
      >
        {{ t("mediaItem.changeMediaList.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
        @click="emits('clone')"
      >
        {{ t("mediaItem.createClone.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
        scheme="tertiary"
        @click="handleDeleteMediaItem"
      >
        {{ t("mediaItem.removeFromList") }}
        <UiIcon
          name="icon:trash"
          :class="$style.iconEnd"
          :size="18"
        />
      </UiButton>
    </div>
    <UiDivider />
    <MediaCardTrackingMenu :media-item="props.mediaItem" />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @layer external {
    .menuItem {
      width: 100%;
      @include dropdownItem;

      &:hover,
      &:focus,
      &:active {
        background: var(--c-white-05);
      }
    }
  }
}
</style>
