<script lang="ts" setup>

import { useLocalePath } from "#i18n";
import { computed } from "#imports";
import { searchStore } from "~/stores/searcStore";
import { useRoute } from "#app";
import { UiTypography } from "~/components/newUi/UiTypography"
import { LogoIcon } from "~/components/ui//icons";

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
  <NuxtLink
    :to="localePath('/')"
    :class="$style.wrapper"
    @click="onClickLogo"
  >
    <LogoIcon />
    <UiTypography
      :class="$style.title"
    >
      Movie Tracker
    </UiTypography>
  </NuxtLink>
</template>

<style lang="scss" module>

.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;

  .title {
    color: var(--c-text);
    font-family: var(--ff-neue-haas);
    font-weight: var(--fw-medium);
    font-size: var(--fs-logo);
  }
}
</style>
