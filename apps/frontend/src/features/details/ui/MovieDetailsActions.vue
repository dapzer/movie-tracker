<script setup lang="ts">

import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :class="$style.addToListButton"
      variant="boxed"
    >
      <ListIcon />
      {{ $t('mediaList.addToList') }}
    </UiButton>
  </div>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";
.wrapper {
  display: flex;
  justify-content: flex-start;
  gap: 8px;

  @include mobileDevice() {
    &,
    button {
      width: 100%;
    }
  }

  .addToListButton {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: var(--fs-label-small) !important;
  }
}
</style>
