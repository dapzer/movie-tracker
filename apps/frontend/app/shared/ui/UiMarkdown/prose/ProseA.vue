<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { computed } from "vue"
import { UiTypography } from "~/shared/ui/UiTypography"

interface ProseAProps {
  href: string
  target?: "_blank" | "_parent" | "_self" | "_top" | (string & object) | null
}

const props = withDefaults(defineProps<ProseAProps>(), {
  target: "_blank",
})

const localePath = useLocalePath()

const isIternalUrl = computed(() => {
  return props.href.startsWith("/")
})

const href = computed(() => {
  if (isIternalUrl.value) {
    return localePath(props.href)
  }
  return props.href
})
</script>

<template>
  <UiTypography
    :as="NuxtLink"
    schema="link"
    :href="href"
    :target="isIternalUrl ? '_self' : props.target"
  >
    <slot />
  </UiTypography>
</template>
