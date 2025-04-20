<script setup lang="ts">
import { ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import UiTooltip from "~/shared/ui/UiTooltip/UiTooltip.vue"
import { UiTypography } from "~/shared/ui/UiTypography"

const align = ref<"start" | "center" | "end">("start")
const side = ref<"top" | "right" | "bottom" | "left">("bottom")
</script>

<template>
  <Story
    title="UiTooltip"
    group="ui-kit"
  >
    <template #default>
      <UiTooltip
        :align="align"
        :side="side"
      >
        <template #trigger>
          <UiButton>Click me</UiButton>
        </template>

        <template #content>
          <div class="p-2">
            <UiTypography>Tooltip content</UiTypography>
            <UiTypography>Tooltip content</UiTypography>
            <UiTypography>Tooltip content</UiTypography>
          </div>
        </template>
      </UiTooltip>
    </template>

    <template #controls>
      <HstSelect
        v-model="align"
        title="Align"
        :options="['start', 'center', 'end']"
      />
      <HstSelect
        v-model="side"
        title="Side"
        :options="['top', 'right', 'bottom', 'left']"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
