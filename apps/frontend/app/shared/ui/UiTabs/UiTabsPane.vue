<script setup lang="ts" generic="T extends readonly UiTab[]">
import type { VNode } from "vue"
import type { UiTab } from "~/shared/ui/UiTabs/model/types"
import { UiSlider } from "~/shared/ui/UiSlider"
import UiTabsPaneWrapper from "~/shared/ui/UiTabs/UiTabsPaneWrapper.vue"
import UiTabsWrapper from "~/shared/ui/UiTabs/UiTabsWrapper.vue"
import UiTabTrigger from "~/shared/ui/UiTabs/UiTabTrigger.vue"

const props = defineProps<{
  tabs: T
}>()

defineSlots<{
  [K in T[number]["key"]]: () => VNode
} & {
  afterTabs?: () => VNode
  content: () => VNode
}>()

const activeTab = defineModel<string>({ default: "" })

if (!activeTab.value) {
  activeTab.value = props.tabs[0]?.key ?? ""
}
</script>

<template>
  <UiTabsWrapper>
    <UiTabsPaneWrapper>
      <UiSlider
        :data="props.tabs as unknown as Array<UiTab>"
        max-width="max-content"
        :spaceing="4"
        hide-buttons
      >
        <template #slide="{ item }">
          <UiTabTrigger
            :key="item.key"
            :active="activeTab === item.key"
            :href="item.href"
            @click="activeTab = item.key"
          >
            {{ item.label }}
          </UiTabTrigger>
        </template>
      </UiSlider>
      <slot name="afterTabs" />
    </UiTabsPaneWrapper>

    <slot name="content" />
  </UiTabsWrapper>
</template>
