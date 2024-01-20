<script lang="ts" setup>
import type { MediaItemType, MediaDetailsType, MediaDetailsInfoType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed } from "vue";
import { getTmdbImageUrl, useI18n } from "#imports";
import { UiCard } from "~/components/ui/UiCard";
import { useLocalePath } from "#i18n";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";
import UiDropdown from "~/components/ui/UiDropdown.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { ChartCandleIcon } from "~/components/ui/icons";
import { MovieCardStatusSelectorMenu } from "~/features/mediaItem";
import MediaCardTrackingMenu from "~/features/mediaItem/ui/trackingMenu/MediaCardTrackingMenu.vue";
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails";
import UiScoreCircle from "~/components/ui/UiScoreCircle.vue";

interface MediaItemCardProps {
  mediaItem: MediaItemType;
  isHideControls?: boolean;
}

const props = defineProps<MediaItemCardProps>();
const localePath = useLocalePath();
const { locale, t } = useI18n();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem, locale.value);
});

const description = computed(() => {
  return `${t("mediaItem.addedDate")} ${new Date(props.mediaItem.createdAt).toLocaleDateString(locale.value)}`
})
</script>

<template>
  <UiCard
    :class="$style.wrapper"
    :title="currentMediaDetails?.title || ''"
    :image="getTmdbImageUrl(currentMediaDetails?.poster || '')"
    :link="localePath(`/details/${mediaItem.mediaType}/${mediaItem.mediaId}`)"
    :description="description"
  >
    <UiScoreCircle
      :class="$style.score"
      :value="mediaItem.mediaDetails?.score || 0"
    />

    <UiDropdown
      v-if="!props.isHideControls"
      :wrapper-class="$style.statusSelector"
    >
      <template #trigger>
        <UiButton>
          <ChartCandleIcon />
          {{ $t("mediaItem.changeStatus") }}
        </UiButton>
      </template>
      <template #content>
        <MovieCardStatusSelectorMenu :media-item="mediaItem" />
      </template>
    </UiDropdown>

    <UiLinkToDetails
      :media-id="mediaItem.mediaId"
      :media-type="mediaItem.mediaType"
    />

    <MediaCardTrackingMenu :media-item="mediaItem" />
  </UiCard>
</template>

<style lang="scss" module>
@import "~/styles/mixins";

.wrapper {
  margin-top: 10px;
}

.score {
  position: absolute;
  top: -10px;
  left: -10px;
}

.statusSelector {
  position: absolute;
  right: 0;
  top: 30px;

  & > button {
    @include cardSideButton();
    font-weight: lighter;

    svg {
      width: 1em;
    }
  }
}
</style>
