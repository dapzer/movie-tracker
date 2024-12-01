<script setup lang="ts">

import { listsNavigationLinks } from "~/widgets/header/model/listsNavigationLinks"
import { UiTypography } from "~/components/newUi/UiTypography"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiDivider } from "~/components/newUi/UiDivider"
import DefaultHeaderMobileMenuFooter from "~/widgets/header/ui/defaultHeader/DefaultHeaderMobileMenuFooter.vue"
import { UiModalFullscreen } from "~/components/newUi/UiModal"
import { UiContainer } from "~/components/newUi/UiContainer"

const model = defineModel<boolean>()
const localePath = useLocalePath();
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
            v-for="(link, index) in listsNavigationLinks"
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
            <UiDivider v-if="index < listsNavigationLinks.length - 1" />
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
