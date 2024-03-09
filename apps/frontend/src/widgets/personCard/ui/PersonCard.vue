<script lang="ts" setup>
import { UiCard } from "~/components/ui/UiCard";
import { computed } from "#imports";
import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";
import { useLocalePath } from "#i18n";
import { type TmdbSearchResponseResultItemType, type TmdbCreditsCastType, TmdbMediaTypeEnum } from "@movie-tracker/types";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";
import { getTmdbImageUrl } from "~/utils/getTmdbImageUrl";

interface PersonCardProps {
  person: TmdbSearchResponseResultItemType | TmdbCreditsCastType;
  width?: number
  isHorizontal?: boolean
  isSmall?: boolean
}

const props = defineProps<PersonCardProps>();

const image = computed(() => props.person.profile_path);
const localePath = useLocalePath();
</script>

<template>
  <UiCard
    :width="props.width"
    :is-horizontal="props.isHorizontal"
    :is-small="props.isSmall"
    :image="getTmdbImageUrl(image, 260)"
    :link="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${props.person.id}`)"
    :title="props.person.name"
  >
    <slot />
    <UiLinkToDetails
      :media-id="props.person.id"
      :media-type="TmdbMediaTypeEnum.PERSON"
    />
  </UiCard>
</template>

<style lang="scss" module>
</style>
