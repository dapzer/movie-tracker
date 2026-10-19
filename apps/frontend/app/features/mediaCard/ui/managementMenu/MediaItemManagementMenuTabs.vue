<script setup lang="ts" generic="T extends readonly UiTab[]">
import type { VNode } from "vue"
import type { UiTab } from "~/shared/ui/UiTabs/model/types"
import { UiTabTrigger } from "~/shared/ui/UiTabs"

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
  <div :class="$style.wrapper">
    <div :class="$style.tabs">
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
    </div>

    <slot :name="activeTab as unknown as keyof typeof slots" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  width: 100%;

  > * {
    flex: 1;
    min-width: 0;
  }
}
</style>
