<script setup lang="ts">

import { MediaItemStatusNameEnum, type MediaItemType } from "@movie-tracker/types"
import { UiSelect } from "~/components/newUi/UiSelect"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { UiDivider } from "~/components/newUi/UiDivider"
import { UiButton } from "~/components/newUi/UiButton"
import { SelectArrowIcon } from "~/components/ui/icons"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemTrackingMenu.vue"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemManagementMenuDrawerProps>();
const { t } = useI18n()
const isShowTrackingMenu = ref(false)

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
    <UiButton
      :class="$style.menuItem"
      variant="text"
      @click="isShowTrackingMenu = !isShowTrackingMenu"
    >
      {{ t("mediaItem.trackingMenu.title") }}
      <div
        :class="[$style.iconEnd, $style.icon, {
          [$style.iconRotated]: isShowTrackingMenu
        }]"
      >
        <SelectArrowIcon />
      </div>
    </UiButton>
    <MediaCardTrackingMenu
      v-if="isShowTrackingMenu"
      :media-item="props.mediaItem"
    />
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 284px;
  min-width: 284px;

  @layer external {
    .menuItem {
      width: 100%;
      @include dropdownItem;
    }
  }


  .iconRotated {
    transform: rotate(180deg);
  }
}
</style>
