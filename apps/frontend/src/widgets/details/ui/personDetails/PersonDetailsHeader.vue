<script lang="ts" setup>
import type { TmdbPersonExternalIdsType, TmdbPersonType } from "@movie-tracker/types";
import { UiInfoHeader } from "~/components/newUi/UiInfoHeader";
import { formatDate, getProxiedImageUrl, getYearDeclensionTranslationKey, useI18n } from "#imports";
import { getPersonSocialList } from "~/widgets/details/model/getPersonSocialList";
import { computed } from "vue";
import PersonDetailsSocialList from "~/widgets/details/ui/personDetails/PersonDetailsSocialList.vue"

interface PersonDetailsHeaderProps {
  details?: TmdbPersonType | null;
  externalIds?: TmdbPersonExternalIdsType | null;
}

const props = defineProps<PersonDetailsHeaderProps>();
const { locale } = useI18n();

const socialList = computed(() => {
  if (!props.externalIds) {
    return [];
  }

  return getPersonSocialList(props.externalIds);
});

const birthdayAge = computed(() => {
  if (!props.details?.birthday) {
    return undefined;
  }

  return (props.details?.deathday ? new Date(props.details?.deathday) : new Date()).getFullYear() -
      new Date(props.details?.birthday).getFullYear();
})
</script>

<template>
  <UiInfoHeader
    v-if="props.details"
    :image="getProxiedImageUrl(props.details?.profile_path, 350)"
    :title="props.details?.name ?? ''"
    :overview="props.details?.biography"
    fallback-image="/avatarPoster.svg"
    :description="$t(`details.knowFor.${props.details.known_for_department}`) "
  >
    <template
      v-if="props.details"
      #tableItems
    >
      <tr v-if="birthdayAge">
        <td>{{ $t("details.birthday") }}</td>
        <td>
          {{ formatDate(props.details?.birthday, locale) }} ({{ birthdayAge }}
          {{ $t(`ui.${getYearDeclensionTranslationKey(birthdayAge)}`) }})
        </td>
      </tr>
      <tr v-if="props.details.deathday">
        <td>{{ $t("details.deathday") }}</td>
        <td>
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
      v-if="socialList.length"
      #posterFooter
    >
      <PersonDetailsSocialList :socialList="socialList" />
    </template>
  </UiInfoHeader>
</template>

<style lang="scss" module>
</style>
