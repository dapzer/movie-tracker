<script setup lang="ts">

import { navigationLinks } from "~/components/layout/defaultHeader/navigationLinks";
import { NuxtLink } from "#components";
import { useLocalePath } from "#i18n";
import UiTypography from "~/components/ui/UiTypography.vue";

const localePath = useLocalePath();
const emit = defineEmits<{
  (e: "onClickLink"): void
}>();

</script>

<template>
  <nav>
    <ul
      :class="$style.wrapper"
      v-bind="$attrs"
    >
      <li
        v-for="link in navigationLinks"
        :key="link.path"
      >
        <UiTypography
          :activeClass="$style.active"
          :as="NuxtLink"
          :class="$style.link"
          :to="localePath(link.path)"
          variant="link"
          @click="emit('onClickLink')"
        >
          {{ $t(link.title) }}
        </UiTypography>
      </li>
    </ul>
  </nav>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.active {
  color: var(--c-highlight);
}
</style>
