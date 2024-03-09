<script lang="ts" setup>
import type { TmdbPersonExternalIdsType, TmdbPersonType } from "@movie-tracker/types";
import { getTmdbImageUrl } from "~/utils/getTmdbImageUrl";
import UiInfoHeader from "~/components/ui/UiInfoHeader.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import { useI18n } from "#imports";
import { arrayToString } from "@movie-tracker/utils";
import { getPersonSocialList } from "~/features/details/model/getPersonSocialList";
import { computed } from "vue";
import PersonDetailsSocialList from "~/features/details/ui/personDetails/PersonDetailsSocialList.vue";

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
})
</script>

<template>
  <UiInfoHeader
    :image="getTmdbImageUrl(props.details?.profile_path, 350)"
    :title="props.details?.name ?? ''"
  >
    <UiTypography
      v-if="props.details?.birthday"
      as="li"
      variant="listItem"
    >
      {{ $t("details.birthday") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ new Date(props.details?.birthday || "").toLocaleDateString(locale) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.deathday"
      as="li"
      variant="listItem"
    >
      {{ $t("details.deathday") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ new Date(props.details?.deathday || "").toLocaleDateString(locale) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.place_of_birth"
      as="li"
      variant="listItem"
    >
      {{ $t("details.placeOfBirth") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ props.details?.place_of_birth }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.known_for_department"
      as="li"
      variant="listItem"
    >
      {{ $t("details.fameFor") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ props.details?.known_for_department }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.also_known_as?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.alsoKnownAs") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ arrayToString(props.details?.also_known_as) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="!!socialList.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.socialNetworks") }}:
      <PersonDetailsSocialList :social-list="socialList" />
    </UiTypography>
  </UiInfoHeader>
</template>

<style lang="scss" module>
</style>
