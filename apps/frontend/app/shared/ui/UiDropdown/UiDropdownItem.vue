<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import type { UiDropdownSize } from "~/shared/ui/UiDropdown/UiDropdown.vue"
import { inject } from "#imports"
import { DropdownMenuItem } from "radix-vue"
import { uiDropdownSizeInjectionKey } from "~/shared/ui/UiDropdown/model/constants"

interface UiDropdownItemProps {
  as?: ComponentOrTag
}

const props = defineProps<UiDropdownItemProps>()
const slots = defineSlots()
const size = inject<UiDropdownSize | undefined>(uiDropdownSizeInjectionKey)
</script>

<template>
  <DropdownMenuItem
    :as="props.as"
    :class="[$style.wrapper, {
      [$style.wrapperSmall]: size === 'small',
    }]"
  >
    <div
      v-if="slots.iconStart"
      :class="$style.icon"
    >
      <slot name="iconStart" />
    </div>
    <slot name="content" />
    <div
      v-if="slots.iconEnd"
      :class="[$style.iconEnd, $style.icon]"
    >
      <slot name="iconEnd" />
    </div>
  </DropdownMenuItem>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  @include dropdownItem;
}

.wrapperSmall {
  font-size: var(--fs-label-small);
  font-weight: var(--fw-regular);
}
</style>
