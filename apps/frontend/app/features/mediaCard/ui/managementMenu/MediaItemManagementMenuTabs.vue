<script setup lang="ts" generic="T extends readonly UiTab[]">
import type { VNode } from "vue"
import type { UiTab } from "~/shared/ui/UiTabs/model/types"
import { UiTabsPaneWrapper, UiTabsWrapper, UiTabTrigger } from "~/shared/ui/UiTabs"

const props = defineProps<{
  tabs: T
}>()

const slots = defineSlots<{
  [K in T[number]["key"]]: () => VNode
}>()

const activeTab = defineModel<string>({ default: "" })

if (!activeTab.value) {
  activeTab.value = props.tabs[0]?.key ?? ""
}
</script>

<template>
  <UiTabsWrapper>
    <UiTabsPaneWrapper schema="secondary">
      <UiTabTrigger
        v-for="item in props.tabs"
        :key="item.key"
        :active="activeTab === item.key"
        :description="item.description"
        scheme="secondary"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </UiTabTrigger>
    </UiTabsPaneWrapper>

    <slot :name="activeTab as unknown as keyof typeof slots" />
  </UiTabsWrapper>
</template>
