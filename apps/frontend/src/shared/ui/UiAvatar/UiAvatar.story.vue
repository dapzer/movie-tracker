<script setup lang="ts">

import UiAvatar from '~/shared/ui/UiAvatar/UiAvatar.vue';
import { getPlaceholderImageUrl } from '~/utils/getPlaceholderImageUrl';
</script>

<template>
  <Story
    group="ui-kit"
    title="UiAvatar"
  >
    <template #default>
      <Variant title="Randomised">
        <UiAvatar />
      </Variant>
      <Variant title="RandomisedAndStored">
        <UiAvatar placeholder-id="id" />
      </Variant>

      <Variant title="WithImage">
        <UiAvatar :src="getPlaceholderImageUrl(32, 32)" />
      </Variant>
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
