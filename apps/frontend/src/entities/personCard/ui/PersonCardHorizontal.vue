<script lang="ts" setup>
import type { TmdbCreditsCastType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import type { UiMediaCardHorizontalSize } from "~/shared/ui/UiCard"
import { useLocalePath } from "#i18n"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { UiMediaCardHorizontal } from "~/shared/ui/UiCard"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface PersonCardHorizontalProps {
  person: TmdbSearchResponseResultItemType | TmdbCreditsCastType
  width?: number
  birthday?: string
  fullHeight?: boolean
  imageWidth?: number
  size?: UiMediaCardHorizontalSize
}

const props = defineProps<PersonCardHorizontalProps>()

const localePath = useLocalePath()
</script>

<template>
  <UiMediaCardHorizontal
    :sub-description="$t(`details.department.${props.person.known_for_department}`)"
    :image-src="getProxiedImageUrl(props.person.profile_path, 360)"
    :link-url="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${props.person.id}`)"
    :width="props.width"
    :full-height="props.fullHeight"
    :image-width="props.imageWidth"
    fallback-image-src="/avatar.svg"
  >
    <template #title>
      <UiTypography
        :class="$style.title"
        variant="cardTitle"
      >
        {{ props.person.name }}
      </UiTypography>
    </template>

    <template #description>
      <slot name="description" />
    </template>
  </UiMediaCardHorizontal>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";

.title {
  @include multiLineEllipsis(2);
}
</style>
