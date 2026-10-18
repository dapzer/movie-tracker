<script setup lang="ts">
import UiAvatar from "~/shared/ui/UiAvatar/UiAvatar.vue"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiAvatar"
  >
    <template #default>
      <Variant title="Randomised">
        <UiAvatar alt="Avatar placeholder" />
      </Variant>
      <Variant title="RandomisedAndStored">
        <UiAvatar
          placeholder-id="id"
          alt="Avatar placeholder"
        />
      </Variant>

      <Variant title="WithImage">
        <UiAvatar
          :src="getPlaceholderImageUrl(32, 32)"
          alt="User avatar"
        />
      </Variant>
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
