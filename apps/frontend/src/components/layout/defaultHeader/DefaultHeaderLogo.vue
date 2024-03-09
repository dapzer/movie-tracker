<script lang="ts" setup>

import { NuxtLink } from "#components";
import { LanguageSelector } from "~/features/languegeSelector";
import { useLocalePath } from "#i18n";
import UiTypography from "~/components/ui/UiTypography.vue";
import { computed } from "#imports";
import { searchStore } from "~/stores/searcStore";
import { useRoute } from "#app";

interface DefaultHeaderLogoProps {
  isMobileMenuOpen: boolean;
}

const props = defineProps<DefaultHeaderLogoProps>();
const localePath = useLocalePath();
const router = useRoute();
const searchValue = computed(() => searchStore.state.searchValue);

const onClickLogo = () => {
  if (searchValue.value && router.path == localePath("/")) {
    searchStore.onChangeSearch("");
  }
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      v-if="!props.isMobileMenuOpen"
      :as="NuxtLink"
      :class="$style.logo"
      :to="localePath('/')"
      variant="title3"
      @click="onClickLogo"
    >
      Movie Tracker
    </UiTypography>
    <LanguageSelector
      :class="{
        [$style.localeHider]: !props.isMobileMenuOpen
      }"
    />
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  display: flex;
  align-items: center;
  gap: 20px;

  .logo {
    font-size: var(--fs-logo);

    @media screen and (max-width: $bp-md) {
      font-size: var(--fs-m-logo);
    }
  }

  @media screen and (max-width: $bp-md) {
    .localeHider {
      display: none;
    }
  }
}
</style>
