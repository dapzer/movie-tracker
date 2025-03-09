<script lang="ts" setup>
import type { TmdbCreditsCastType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import {

  TmdbMediaTypeEnum,

} from "@movie-tracker/types"
import { UiMediaCard } from "~/shared/ui/UiCard"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl"

interface PersonCardProps {
  person: TmdbSearchResponseResultItemType | TmdbCreditsCastType
  width?: number
  birthday?: string
  fullHeight?: boolean
}

const props = defineProps<PersonCardProps>()

const { locale } = useI18n()
const localePath = useLocalePath()

const birthday = computed(() => {
  if (!props.birthday) {
    return undefined
  }
  const date = new Date(props.birthday)
  const today = new Date()
  const age = today.getFullYear() - date.getFullYear()

  return `${age} (${date.getFullYear().toLocaleString(locale.value)})`
})
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
        {{ $t(`details.department.${props.person.known_for_department}`) }}
      </UiTypography>

      <slot name="content" />
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
</style>
