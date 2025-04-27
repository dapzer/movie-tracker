<script setup lang="ts">
import type { UiDropdownSize } from "~/shared/ui/UiDropdown/UiDropdown.vue"
import { inject } from "#imports"
import { DropdownMenuGroup } from "radix-vue"
import { uiDropdownSizeInjectionKey } from "~/shared/ui/UiDropdown/model/constants"

const size = inject<UiDropdownSize | undefined>(uiDropdownSizeInjectionKey)
</script>

<template>
  <DropdownMenuGroup
    :class="[$style.wrapper, {
      [$style.wrapperSmall]: size === 'small',
    }]"
  >
    <slot />
  </DropdownMenuGroup>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wrapperSmall {
  gap: 0;
}
</style>
