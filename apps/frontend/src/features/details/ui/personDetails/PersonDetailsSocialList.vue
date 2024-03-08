<script setup lang="ts">
import type { PersonSocialType } from "~/features/details/model/PersonSocialType";
import { NuxtLink } from "#components";
import UiTypography from "~/components/ui/UiTypography.vue";

interface PersonDetailsSocialListProps {
  socialList: PersonSocialType[]
}

const props = defineProps<PersonDetailsSocialListProps>();

</script>

<template>
  <template
    v-for="(social, index) in props.socialList"
    :key="social"
  >
    <UiTypography
      :as="NuxtLink"
      :to="social.url"
      target="_blank"
      variant="linkUnderlined"
    >
      {{ social.name }}
    </UiTypography>
    {{ index !== props.socialList.length - 1 ? ', ' : '' }}
  </template>
</template>

<style module lang="scss">

</style>
