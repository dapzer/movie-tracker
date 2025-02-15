<script setup lang="ts" generic="T extends readonly { key: string; label: string }[]">
import { type VNode } from "vue"
import UiTabTrigger from "~/shared/ui/UiTabs/UiTabTrigger.vue"

const props = defineProps<{
  tabs: T
}>()

const slots = defineSlots<{
  [K in T[number]['key']]: () => VNode
} & {
  afterTabs?: () => VNode
  content: () => VNode
}>()

const activeTab = defineModel<string>({default: ''})

if (!activeTab.value) {
  activeTab.value = props.tabs[0].key
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.navigationWrapper">
      <div :class="$style.navigation">
        <UiTabTrigger
          v-for="tab in props.tabs"
          :key="tab.key"
          :active="activeTab === tab.key"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </UiTabTrigger>
      </div>
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

    .navigation {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      gap: 4px;
    }
  }
}
</style>
