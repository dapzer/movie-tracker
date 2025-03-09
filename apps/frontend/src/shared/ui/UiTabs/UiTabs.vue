<script setup lang="ts" generic="T extends readonly { key: string; label: string }[]">
import type { VNode } from "vue"
import UiTabsPane from "~/shared/ui/UiTabs/UiTabsPane.vue"

const props = defineProps<{
  tabs: T
}>()

const slots = defineSlots<{
  [K in T[number]["key"]]: () => VNode
} & {
  afterTabs?: () => VNode
}>()

const activeTab = defineModel<string>({ default: "" })

if (!activeTab.value) {
  activeTab.value = props.tabs[0].key
}
</script>

<template>
  <UiTabsPane
    v-model="activeTab"
    :tabs="props.tabs"
  >
    <template
      v-if="slots.afterTabs"
      #afterTabs
    >
      <slot name="afterTabs" />
    </template>
    <template #content>
      <slot :name="activeTab as unknown as keyof typeof slots" />
    </template>
  </UiTabsPane>
</template>

<style module lang="scss">
</style>
