<script setup lang="ts">
import type { TmdbCreditsCastType, TmdbMediaDetailsCreatedByType } from "@movie-tracker/types";
import { NuxtLink } from "#components";
import { useLocalePath } from "#i18n";
import UiTypography from "~/components/ui/UiTypography.vue";

interface MovieDetailsProducersProps {
  producers: TmdbCreditsCastType[] | TmdbMediaDetailsCreatedByType[];
}

const props = defineProps<MovieDetailsProducersProps>();
const localePath = useLocalePath()

</script>

<template>
  <template
    v-for="(producer, index) in props.producers"
    :key="producer.id"
  >
    <UiTypography
      :as="NuxtLink"
      :to="localePath(`/details/person/${producer.id}`)"
      variant="linkUnderlined"
    >
      {{ producer.name }}
    </UiTypography>
    {{ index !== props.producers.length - 1 ? ', ' : '' }}
  </template>
</template>
