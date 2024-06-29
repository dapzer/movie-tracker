<script setup lang="ts">
import { useAttrs } from "#imports"
import { CheckIcon } from "~/components//ui/icons"

const inputModel = defineModel<boolean>();
const attrs = useAttrs()
</script>

<template>
  <label
    :class="[$style.body, {
      [$style.disabled]: attrs.disabled,
      [$style.checked]: inputModel
    }]"
  >
    <input
      v-model="inputModel"
      v-bind="$attrs"
      type="checkbox"
    >
    <span :class="$style.transition">
      <CheckIcon />
    </span>
  </label>
</template>

<style module lang="scss">
.body {
  display: block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--c-white-35);
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  span {
    display: none;
  }

  &.checked {
    border-color: var(--c-label-secondary);
  }

  &.disabled {
    opacity: var(--s-disabled-opacity);
    pointer-events: none;
  }
}

.body input:checked + span {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--c-label-secondary);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.body input {
  position: absolute;
  width: 100%;
  height: 100%;
  visibility: hidden;
}

</style>
