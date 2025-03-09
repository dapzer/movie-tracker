<script lang="ts" setup>
import type { TmdbPersonExternalIdsType, TmdbPersonType } from "@movie-tracker/types"
import { formatDate, getProxiedImageUrl, getYearDeclensionTranslationKey, useI18n } from "#imports"
import { computed } from "vue"
import { UiInfoHeader } from "~/shared/ui/UiInfoHeader"
import { UiSocialList } from "~/shared/ui/UiSocialList"

interface PersonDetailsHeaderProps {
  details?: TmdbPersonType | null
  externalIds?: TmdbPersonExternalIdsType | null
}

const props = defineProps<PersonDetailsHeaderProps>()
const { locale } = useI18n()

const birthdayAge = computed(() => {
  if (!props.details?.birthday) {
    return undefined
  }

  return (props.details?.deathday ? new Date(props.details?.deathday) : new Date()).getFullYear()
    - new Date(props.details?.birthday).getFullYear()
})
</script>

<template>
  <UiInfoHeader
    v-if="props.details"
    :image="getProxiedImageUrl(props.details?.profile_path, 350)"
    :title="props.details?.name ?? ''"
    :overview="props.details?.biography"
    fallback-image="/avatarPoster.svg"
    :description="props.details.known_for_department ? $t(`details.department.${props.details.known_for_department}`)
      : undefined"
  >
    <template
      v-if="props.details"
      #tableItems
    >
      <tr v-if="birthdayAge">
        <td>{{ $t("details.birthday") }}</td>
        <td data-allow-mismatch>
          {{ formatDate(props.details?.birthday, locale) }} ({{ birthdayAge }}
          {{ $t(`ui.${getYearDeclensionTranslationKey(birthdayAge)}`) }})
        </td>
      </tr>
      <tr v-if="props.details.deathday">
        <td>{{ $t("details.deathday") }}</td>
        <td data-allow-mismatch>
          {{ formatDate(props.details?.deathday, locale) }}
        </td>
      </tr>
      <tr v-if="props.details?.place_of_birth">
        <td>{{ $t("details.placeOfBirth") }}</td>
        <td>
          {{ props.details?.place_of_birth }}
        </td>
      </tr>
      <tr>
        <td>{{ $t("details.gender.title") }}</td>
        <td>
          {{ $t(`details.gender.${props.details.gender}`) }}
        </td>
      </tr>
    </template>

    <template
      v-if="externalIds"
      #posterFooter
    >
      <UiSocialList
        :social-list="{
          instagram: externalIds?.instagram_id,
          twitter: externalIds?.twitter_id,
          tiktok: externalIds?.tiktok_id,
          youtube: externalIds?.youtube_id,
          facebook: externalIds?.facebook_id,
        }"
      />
    </template>
  </UiInfoHeader>
</template>

<style lang="scss" module>
</style>
