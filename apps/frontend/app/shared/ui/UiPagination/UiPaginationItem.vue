<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiButton } from "~/shared/ui/UiButton"

interface UiPaginationItemProps {
  isActive: boolean
  to?: string
}

const props = defineProps<UiPaginationItemProps>()
</script>

<template>
  <UiButton
    :as="props.to ? NuxtLink : 'button'"
    :to="props.to"
    :scheme="props.isActive ? 'secondary' : 'default'"
  >
    <slot />
  </UiButton>
</template>

<style module lang="scss">
</style>
