<script lang="ts" setup>
import type { TmdbPersonCastType, TmdbSearchResponseResultItemType, TmdbPersonCrewType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { UiCard } from "~/components/ui/UiCard";
import { computed, useI18n } from "#imports";
import { useLocalePath } from "#i18n";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";
import UiScoreCircle from "~/components/ui/UiScoreCircle.vue";
import { getTmdbImageUrl } from "~/utils/getTmdbImageUrl";
import { MediaListSelectorModal } from "~/features/mediaListSelector";

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType | TmdbPersonCastType | TmdbPersonCrewType;
  width?: number;
  isHorizontal?: boolean;
  isSmall?: boolean;
  isHideScore?: boolean;
  isHideMediaListSelector?: boolean;
}

const props = defineProps<MovieCardProps>();

const image = computed(() => props.movie.poster_path);
const localePath = useLocalePath();
const { locale } = useI18n();
const releaseDate =
  computed(() => new Date(props.movie.release_date || props.movie.first_air_date || "").toLocaleDateString(locale.value));
</script>

<template>
  <UiCard
    :class="[$style.wrapper, {
      [$style.wrapperWithScore]: !props.isHideScore
    }]"
    :description="`${$t('details.releaseDate')}: ${releaseDate}`"
    :image="getTmdbImageUrl(image)"
    :is-horizontal="props.isHorizontal"
    :is-small="props.isSmall"
    :link="localePath(`/details/${movie.media_type}/${movie.id}`)"
    :title="movie.title || movie.name || movie.original_name"
    :width="props.width"
  >
    <div
      v-if="!props.isHideMediaListSelector"
      :class="$style.mediaListSelector"
    >
      <MediaListSelectorModal
        :media-id="movie.id"
        :media-type="movie.media_type as TmdbMediaTypeEnum"
      />
    </div>
    <UiScoreCircle
      v-if="!props.isHideScore"
      :class="$style.score"
      :value="movie.vote_average"
    />
    <slot />
    <UiLinkToDetails
      :media-id="props.movie.id"
      :media-type="props.movie.media_type"
    />
  </UiCard>
</template>

<style lang="scss" module>
@import '~/styles/mixins';

.wrapper {
  position: relative;

  .score {
    position: absolute;
    top: -10px;
    left: -10px;
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

  &.wrapperWithScore {
    margin-top: 10px;
  }
}
</style>
