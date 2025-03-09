<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports"
import { UiTypography } from "~/shared/ui/UiTypography"

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === "boolean" && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h1)))
</script>

<template>
  <UiTypography
    :id="props.id"
    as="h2"
    variant="title2"
  >
    <a
      v-if="generate"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </UiTypography>
</template>
