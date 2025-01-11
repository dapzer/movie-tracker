<script setup lang="ts">

import { listsNavigationLinks } from "~/widgets/header/model/listsNavigationLinks"
import { UiTypography } from "~/components/ui/UiTypography"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiDivider } from "~/components/ui/UiDivider"
import DefaultHeaderMobileMenuFooter from "~/widgets/header/ui/defaultHeader/DefaultHeaderMobileMenuFooter.vue"
import { UiModalFullscreen } from "~/components/ui/UiModal"
import { UiContainer } from "~/components/ui/UiContainer"

const model = defineModel<boolean>()
const localePath = useLocalePath();

const navigationLinks = [{
  title: "navigation.about",
  path: "/about",
}, ...listsNavigationLinks]
</script>

<template>
  <UiModalFullscreen
    v-model="model"
    :indent-top="68"
  >
    <template #content>
      <UiContainer :class="$style.wrapper">
        <div :class="$style.links">
          <template
            v-for="(link, index) in navigationLinks"
            :key="link.path"
          >
            <UiTypography
              :as="NuxtLink"
              variant="label"
              :to="localePath(link.path)"
              @click="model = false"
            >
              {{ $t(link.title) }}
            </UiTypography>
            <UiDivider v-if="index < navigationLinks.length - 1" />
          </template>
        </div>
        <DefaultHeaderMobileMenuFooter />
      </UiContainer>
    </template>
  </UiModalFullscreen>
</template>

<style module lang="scss">
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;

  .links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
