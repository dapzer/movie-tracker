<script setup lang="ts" generic="T extends readonly { key: string; label: string }[]">
import { ref, type VNode, watch } from "vue"
import UiTabsPane from "~/components/newUi/UiTabs/UiTabsPane.vue"

const props = defineProps<{
  tabs: T
}>()

const slots = defineSlots<{
  [K in T[number]['key']]: () => VNode
} & {
  afterTabs?: () => VNode
}>()

const model = defineModel<string>()

const activeTab = ref<string>(model.value || props.tabs[0].key);

watch(() => activeTab.value, () => {
  model.value = activeTab.value
}, { immediate: true })
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
