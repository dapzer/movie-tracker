<script lang="ts" setup>
import { UiCard } from "~/components/ui/UiCard";
import { computed } from "#imports";
import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";
import { useLocalePath } from "#i18n";
import {
  type TmdbCreditsCastType,
  TmdbMediaTypeEnum,
  type TmdbSearchResponseResultItemType
} from "@movie-tracker/types";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";

interface PersonCardProps {
  person: TmdbSearchResponseResultItemType | TmdbCreditsCastType;
  width?: number;
  isHorizontal?: boolean;
  isSmall?: boolean;
}

const props = defineProps<PersonCardProps>();

const image = computed(() => props.person.profile_path);
const localePath = useLocalePath();
</script>

<template>
  <UiCard
    :image="getProxiedImageUrl(image, 260)"
    :is-horizontal="props.isHorizontal"
    :is-small="props.isSmall"
    :link="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${props.person.id}`)"
    :title="props.person.name"
    :width="props.width"
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
