<script lang="ts" setup>
interface UiCheckboxProps {
  isDisabled?: boolean;
  size?: number;
}

const props = withDefaults(defineProps<UiCheckboxProps>(), {
  size: 20
});
const inputModel = defineModel();

</script>

<template>
  <label
    :class="[$style.body, {
      [$style.disabled]: props.isDisabled
    }]"
    :style="{
      '--size': `${props.size}px`
    }"
  >
    <input
      v-model="inputModel"
      type="checkbox"
      v-bind="$attrs"
      :disabled="props.isDisabled"
    >
    <div :class="$style.transition" />
  </label>
</template>

<style lang="scss" module>
.body {
  display: block;
  cursor: pointer;
  width: var(--size);
  height: var(--size);
  border: 3px solid rgba(255, 255, 255, 0);
  border-radius: 0.5em;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 0px 2px var(--c-secondary);

  &.disabled {
    opacity: var(--s-disabled-opacity);
    pointer-events: none;
  }
}

.body div {
  width: 60px;
  height: 60px;
  background-color: var(--c-secondary);
  top: -52px;
  left: -52px;
  position: absolute;
  transform: rotateZ(45deg);
  z-index: 100;
}

.body input[type=checkbox]:checked + div {
  left: -10px;
  top: -10px;
}

.body input[type=checkbox] {
  position: absolute;
  left: 50px;
  visibility: hidden;
}

.transition {
  transition: 300ms ease;
}
</style>
