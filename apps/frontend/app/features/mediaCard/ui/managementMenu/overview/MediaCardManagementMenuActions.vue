<script setup lang="ts">
import { useI18n } from "#imports"
import { toast } from "vue3-toastify"
import { useDeleteMediaItemApi } from "~/api/mediaItems/useMediaItemsApi.ts"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaCardManagementMenuActionsProps {
  mediaItemId: string
  mediaType: string
}

const props = defineProps<MediaCardManagementMenuActionsProps>()
const emits = defineEmits<{
  (event: "clone"): void
  (event: "changeMediaList"): void
}>()
const { t } = useI18n()

const deleteMediaItemApi = useDeleteMediaItemApi()

function handleDeleteMediaItem() {
  deleteMediaItemApi.mutateAsync(props.mediaItemId).then(() => {
    toast.success(t("toasts.mediaItem.successRemovedFromCurrentList", {
      media: t(`details.mediaType.${props.mediaType}`),
    }))
  }).catch(() => {
    toast.error(t(`toasts.mediaItem.unsuccessfullyRemovedFromCurrentList${props.mediaType}`))
  })
}
</script>

<template>
  <div :class="$style.wrapper">
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
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;

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
</style>
