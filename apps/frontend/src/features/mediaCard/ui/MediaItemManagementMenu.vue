<script setup lang="ts">

import { MediaItemStatusNameEnum, type MediaItemType } from "@movie-tracker/types"
import { UiSelect } from "~/components/newUi/UiSelect"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiDivider } from "~/components/newUi/UiDivider"
import { UiButton } from "~/components/newUi/UiButton"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemTrackingMenu.vue"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemManagementMenuDrawerProps>();
const { t } = useI18n()

const selectOptions = computed(() => {
  const rea = []

  for (const status in MediaItemStatusNameEnum) {
    rea.push({
      label: t(`mediaItem.status.${status}`),
      value: status
    })
  }

  return rea
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiSelect
      v-model="props.mediaItem.trackingData.currentStatus"
      :options="selectOptions"
    />
    <UiDivider />
    <div :class="$style.actions">
      <UiButton
        :class="$style.menuItem"
        variant="text"
      >
        {{ t("mediaItem.changeMediaList.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
      >
        {{ t("mediaItem.createClone.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
        scheme="tertiary"
      >
        {{ t("mediaItem.removeFromList") }}
      </UiButton>
    </div>
    <UiDivider />
    <MediaCardTrackingMenu :media-item="props.mediaItem" />
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @layer external {
    .menuItem {
      width: 100%;
      @include dropdownItem;
      &:hover {
        background: var(--c-white-05);
      }
    }
  }
}
</style>
