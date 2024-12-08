<script setup lang="ts">
import type { PersonSocialType } from "~/widgets/details/model/PersonSocialType";
import { NuxtLink } from "#components";

interface PersonDetailsSocialListProps {
  socialList: PersonSocialType[]
}

const props = defineProps<PersonDetailsSocialListProps>();

</script>

<template>
  <div :class="$style.wrapper">
    <NuxtLink
      v-for="(social) in props.socialList"
      :key="social.url"
      :to="social.url"
      target="_blank"
    >
      <component :is="social.icon" />
    </NuxtLink>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  a {
    color: var(--c-description);

    &:hover {
      color: var(--c-label-lihk-hovered);
    }
  }
}
</style>
