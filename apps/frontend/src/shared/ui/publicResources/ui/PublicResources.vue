<script setup lang="ts">

import { publicResourcesList } from "~/shared/ui/publicResources/model/publicResourcesList"
</script>

<template>
  <div :class="$style.wrapper">
    <template
      v-for="(resource, index) in publicResourcesList"
      :key="index"
    >
      <NuxtLink
        :to="resource.url"
        target="_blank"
      >
        <component :is="resource.icon" />
      </NuxtLink>
    </template>
  </div>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  gap: 16px;
  align-items: center;

  a {
    display: flex;
  }

  svg {
    width: 32px;

    @include mobilePlusDevice() {
      width: 28px;
    }
  }
}
</style>
