<script setup lang="ts" generic="T extends readonly { key: string; label: string }[]">
import type { VNode } from "vue"
import { UiSlider } from "~/shared/ui/UiSlider"
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
  activeTab.value = props.tabs[0].key
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.navigationWrapper">
      <UiSlider
        :data="props.tabs as unknown as Array<{ key: string; label: string }>"
        max-width="max-content"
        :spaceing="4"
        hide-buttons
      >
        <template #slide="{ item }">
          <UiTabTrigger
            :key="item.key"
            :active="activeTab === item.key"
            @click="activeTab = item.key"
          >
            {{ item.label }}
          </UiTabTrigger>
        </template>
      </UiSlider>
      <slot name="afterTabs" />
    </div>

    <slot name="content" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .navigationWrapper {
    display: flex;
    flex-direction: row;
    gap: 24px;
    justify-content: space-between;
  }
}
</style>
