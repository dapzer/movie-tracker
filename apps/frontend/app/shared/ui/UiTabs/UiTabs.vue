<script setup lang="ts" generic="T extends readonly UiTab[]">
import type { VNode } from "vue"
import type { UiTab } from "~/shared/ui/UiTabs/model/types"
import type { UiTabsPaneScheme } from "~/shared/ui/UiTabs/UiTabsPane.vue"
import UiTabsPane from "~/shared/ui/UiTabs/UiTabsPane.vue"

const props = withDefaults(defineProps<{
  tabs: T
  scheme?: UiTabsPaneScheme
}>(), {
  scheme: "default",
})

const slots = defineSlots<{
  [K in T[number]["key"]]: () => VNode
} & {
  afterTabs?: () => VNode
}>()

const activeTab = defineModel<string>({ default: "" })

if (!activeTab.value) {
  activeTab.value = props.tabs[0]?.key ?? ""
}
</script>

<template>
  <UiTabsPane
    v-model="activeTab"
    :tabs="props.tabs"
    :scheme="props.scheme"
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
