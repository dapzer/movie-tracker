<script lang="ts" setup>
import type { TmdbCreditsCastType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import type { UiMediaCardHorizontalSize } from "~/shared/ui/UiCard"
import { useLocalePath } from "#i18n"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
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
  withoutLink?: boolean
}

const props = defineProps<PersonCardHorizontalProps>()

const localePath = useLocalePath()

const linkUrl = computed(() => {
  if (props.withoutLink) {
    return undefined
  }
  return localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${props.person.id}`)
})
</script>

<template>
  <UiMediaCardHorizontal
    :sub-description="$t(`details.department.${props.person.known_for_department}`)"
    :image-src="getProxiedImageUrl(props.person.profile_path, 360)"
    :link-url="linkUrl"
    :width="props.width"
    :full-height="props.fullHeight"
    :image-width="props.imageWidth"
    fallback-image-src="/avatar.svg"
  >
    <template #title>
      <div :class="$style.titleWrapper">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ props.person.name }}
        </UiTypography>

        <slot name="afterTitle">
        </slot>
      </div>
    </template>

    <template #description>
      <slot name="description" />
    </template>
  </UiMediaCardHorizontal>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";

.titleWrapper {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.title {
  @include multiLineEllipsis(2);
}
</style>
