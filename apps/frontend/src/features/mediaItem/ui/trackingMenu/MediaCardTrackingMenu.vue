<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types";
import UiDetails from "~/components/ui/UiDetails.vue";
import { ref } from "vue";
import UiButton from "~/components/ui/UiButton.vue";
import TrackingMenuSitesToView from "~/features/mediaItem/ui/trackingMenu/TrackingMenuSitesToView.vue";
import TrackingMenuTvProgress from "~/features/mediaItem/ui/trackingMenu/TrackingMenuTvProgress.vue";
import { MediaTypeEnum } from "@movie-tracker/types";
import TrackingMenuNote from "~/features/mediaItem/ui/trackingMenu/TrackingMenuNote.vue";

interface MediaCardTrackingMenuProps {
  mediaItem: MediaItemType
}

type Tab = 'information' | 'note';

const tabs: Tab[] = ['information', 'note'];

const props = defineProps<MediaCardTrackingMenuProps>();

const activeTab = ref<Tab>('information');
</script>

<template>
  <UiDetails
    :title="$t('mediaItem.trackingMenu.title')"
    :class="$style.trigger"
  >
    <div :class="$style.tabs">
      <UiButton
        v-for="el in tabs"
        :key="el"
        :class="{
          [$style.active]: activeTab === el
        }"
        variant="clear"
        @click="activeTab = el"
      >
        {{ $t(`mediaItem.trackingMenu.tabs.${el}`) }}
      </UiButton>
    </div>

    <template v-if="activeTab === 'information'">
      <TrackingMenuSitesToView :media-item="props.mediaItem" />
      <TrackingMenuTvProgress
        v-if="props.mediaItem.mediaType === MediaTypeEnum.TV"
        :media-item="props.mediaItem"
      />
    </template>

    <template v-if="activeTab === 'note'">
      <TrackingMenuNote :media-item="props.mediaItem" />
    </template>
  </UiDetails>
</template>

<style module lang="scss">
.trigger {
  margin-top: 10px;

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--c-text);
    margin-bottom: 16px;

    button {
      width: 100%;
      padding: 6px 0;
      font-size: var(--fs-span);

      &:not(:last-child) {
        border-right: 1px solid var(--c-text);
      }

      &.active {
        color: var(--c-highlight);
      }
    }
  }
}
</style>
