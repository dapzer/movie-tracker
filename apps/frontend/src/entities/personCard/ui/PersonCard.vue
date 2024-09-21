<script lang="ts" setup>
import { computed, useI18n } from "#imports";
import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl";
import { useLocalePath } from "#i18n";
import {
  type TmdbCreditsCastType,
  TmdbMediaTypeEnum,
  type TmdbSearchResponseResultItemType
} from "@movie-tracker/types";
import { UiMediaCard } from "~/components/newUi/UiCard"
import { UiTypography } from "~/components/newUi/UiTypography"

interface PersonCardProps {
  person: TmdbSearchResponseResultItemType | TmdbCreditsCastType;
  width?: number;
  birthday?: string;
  fullHeight?: boolean;
}

const props = defineProps<PersonCardProps>();

const { locale } = useI18n();
const localePath = useLocalePath();

const birthday = computed(() => {
  if (!props.birthday) {
    return undefined;
  }
  const date = new Date(props.birthday);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();

  return `${age} (${date.getFullYear().toLocaleString(locale.value)})`;
});
</script>

<template>
  <UiMediaCard
    :title="props.person.name"
    :description="birthday"
    :image-src="getProxiedImageUrl(props.person.profile_path, 360)"
    :link-url="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${props.person.id}`)"
    :width="props.width"
    :full-height="props.fullHeight"
    fallback-image-src="/avatar.svg"
  >
    <template #content>
      <UiTypography
        v-if="props.person.known_for_department"
        ellipsis
        variant="description"
      >
        {{ $t(`details.knowFor.${props.person.known_for_department}`) }}
      </UiTypography>

      <slot name="content" />
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
</style>
