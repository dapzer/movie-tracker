<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { MediaTypeEnum } from "@movie-tracker/types";
import { computed } from "vue";
import { getTmdbImageUrl, useI18n } from "#imports";
import { UiCard } from "~/components/ui/UiCard";
import { useLocalePath } from "#i18n";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";
import UiDropdown from "~/components/ui/UiDropdown.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { ChartCandleIcon } from "~/components/ui/icons";
import { MovieCardManagementMenu } from "~/features/mediaItem";
import MediaCardTrackingMenu from "~/features/mediaItem/ui/trackingMenu/MediaCardTrackingMenu.vue";
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails";
import UiScoreCircle from "~/components/ui/UiScoreCircle.vue";
import MediaItemCardTvInfo from "~/features/mediaItem/ui/card/MediaItemCardTvInfo.vue";
import { MediaListSelectorModal } from "~/features/mediaListSelector";

interface MediaItemCardProps {
  mediaItem: MediaItemType;
  isHideControls?: boolean;
}

const props = defineProps<MediaItemCardProps>();
const localePath = useLocalePath();
const { locale, t } = useI18n();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value);
});

const description = computed(() => {
  return `${t("mediaItem.addedDate")} ${new Date(props.mediaItem.createdAt).toLocaleDateString(locale.value)}`;
});
</script>

<template>
  <UiCard
    :class="$style.wrapper"
    :description="description"
    :image="getTmdbImageUrl(currentMediaDetails?.poster || '', 260)"
    :link="localePath(`/details/${mediaItem.mediaType}/${mediaItem.mediaId}`)"
    :title="currentMediaDetails?.title || ''"
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
          {{ $t("mediaItem.management") }}
        </UiButton>
      </template>
      <template #content>
        <MovieCardManagementMenu :media-item="mediaItem" />
      </template>
    </UiDropdown>

    <div v-else :class="$style.mediaListSelector">
      <MediaListSelectorModal
        :media-id="props.mediaItem.mediaId"
        :media-type="props.mediaItem.mediaType"
      />
    </div>


    <MediaItemCardTvInfo
      v-if="mediaItem.mediaType === MediaTypeEnum.TV && props.isHideControls"
      :media-item="props.mediaItem"
    />

    <UiLinkToDetails
      :media-id="mediaItem.mediaId"
      :media-type="mediaItem.mediaType"
    />

    <MediaCardTrackingMenu
      v-if="!props.isHideControls"
      :media-item="mediaItem"
    />
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

.mediaListSelector {
  position: absolute;
  top: 30px;
  right: 0;
  overflow: hidden;
  pointer-events: none;

  & > button {
    pointer-events: all;
    @include slideFromRight(31px);
    @include cardSideButton();
  }
}
</style>
