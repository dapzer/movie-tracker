<script lang="ts" setup>
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types";
import { UiCard } from "~/components/ui/UiCard";
import { computed, useI18n } from "#imports";
import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";
import { useLocalePath } from "#i18n";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";
import UiScoreCircle from "~/components/ui/UiScoreCircle.vue";

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType;
  width?: number
  isHorizontal?: boolean
  isSmall?: boolean
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
    :class="$style.wrapper"
    :width="props.width"
    :is-horizontal="props.isHorizontal"
    :is-small="props.isSmall"
    :description="`${$t('details.releaseDate')}: ${releaseDate}`"
    :image="image ? getProxiedImageUrl(`https://image.tmdb.org/t/p/original${image}`) : '/defaultPoster.svg'"
    :link="localePath(`/details/${movie.media_type}/${movie.id}`)"
    :title="movie.title || movie.name || movie.original_name"
  >
    <UiScoreCircle
      :class="$style.score"
      :value="movie.vote_average"
    />
    <UiLinkToDetails
      :media-id="props.movie.id"
      :media-type="props.movie.media_type"
    />
  </UiCard>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;

  .score {
    position: absolute;
    top: -10px;
    left: -10px;
  }
}
</style>
