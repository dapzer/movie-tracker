<script setup lang="ts">

import { listsNavigationLinks } from "~/widgets/header/model/listsNavigationLinks"
import { UiTypography } from "~/components/newUi/UiTypography"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiDivider } from "~/components/newUi/UiDivider"
import DefaultHeaderMobileMenuFooter from "~/widgets/header/ui/defaultHeader/DefaultHeaderMobileMenuFooter.vue"

const emit = defineEmits<{
  (e: "toggleMobileMenu"): void
}>();

const localePath = useLocalePath();
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.links">
      <template
        v-for="(link, index) in listsNavigationLinks"
        :key="link.path"
      >
        <UiTypography
          :as="NuxtLink"
          variant="label"
          :to="localePath(link.path)"
          @click="emit('toggleMobileMenu')"
        >
          {{ $t(link.title) }}
        </UiTypography>
        <UiDivider v-if="index < listsNavigationLinks.length - 1" />
      </template>
    </div>
    <DefaultHeaderMobileMenuFooter />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  position: fixed;
  top: var(--s-header-height);
  left: 0;
  height: calc(100% - var(--s-header-height));
  background-color: var(--c-main-background);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
