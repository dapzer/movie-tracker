<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiTypography } from "~/shared/ui/UiTypography"

interface ProseAProps {
  href: string
  target?: "_blank" | "_parent" | "_self" | "_top" | (string & object) | null
}

const props = withDefaults(defineProps<ProseAProps>(), {
  target: "_blank",
})
</script>

<template>
  <UiTypography
    :as="NuxtLink"
    schema="link"
    :href="props.href"
    :target="props.target"
  >
    <slot />
  </UiTypography>
</template>
