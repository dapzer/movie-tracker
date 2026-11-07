<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useDeleteMediaItemApi } from "~/api/mediaItems/useMediaItemsApi.ts"
import { MediaDetailsReleaseSubscription } from "~/entities/releaseSubscription"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaCardManagementMenuActionsProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaCardManagementMenuActionsProps>()
const emits = defineEmits<{
  (event: "clone"): void
  (event: "changeMediaList"): void
}>()
const { t, locale } = useI18n()

const deleteMediaItemApi = useDeleteMediaItemApi()

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})

function handleDeleteMediaItem() {
  deleteMediaItemApi.mutateAsync(props.mediaItem.id).then(() => {
    toast.success(t("toasts.mediaItem.successRemovedFromCurrentList", {
      media: t(`details.mediaType.${props.mediaItem.mediaType}`),
    }))
  }).catch(() => {
    toast.error(t(`toasts.mediaItem.unsuccessfullyRemovedFromCurrentList${props.mediaItem.mediaType}`))
  })
}
</script>

<template>
  <div :class="$style.wrapper">
    <MediaDetailsReleaseSubscription
      :class="$style.subscription"
      :media-id="props.mediaItem.mediaId"
      :media-type="props.mediaItem.mediaType"
      :release-date="props.mediaItem.mediaDetails?.releaseDate"
      :title="currentMediaDetails?.title || currentMediaDetails?.originalTitle"
    >
      <template #default="{ subscription, isPending, isDisabled, handleSubscribeClick }">
        <UiButton
          :class="$style.menuItem"
          variant="text"
          :disabled="isDisabled || isPending"
          @click="handleSubscribeClick"
        >
          {{ subscription ? $t("releaseSubscription.unsubscribe") : $t("releaseSubscription.subscribe") }}
        </UiButton>
      </template>
    </MediaDetailsReleaseSubscription>
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
  .subscription {
    width: 100% !important;
  }

  .menuItem {
    width: 100%;
    justify-content: flex-start;
    @include dropdownItem;

    &:hover,
    &:focus,
    &:active {
      background: var(--c-white-05);
    }
  }
}
</style>
