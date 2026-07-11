<script lang="ts" setup>
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import { ref } from "vue"

interface UiSpoilerTextProps {
  as?: ComponentOrTag
  disabled?: boolean
}

const props = withDefaults(defineProps<UiSpoilerTextProps>(), {
  as: "div",
  disabled: false,
})

const isShowSpoiler = ref(false)

function handleChange() {
  if (props.disabled) {
    return
  }
  isShowSpoiler.value = !isShowSpoiler.value
}
</script>

<template>
  <component
    :is="props.as"
    :class="[{ [$style.active]: !isShowSpoiler && !props.disabled, [$style.wrapper]: !props.disabled }]"
    @click="handleChange"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  transition: all 0.2s linear;
}

.active {
  filter: blur(5px);
}
</style>
z
