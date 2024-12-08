<script lang="ts" setup>
import { ref } from "vue";

const isShowSpoiler = ref(false);
</script>

<template>
  <div
    :class="[$style.wrapper, { [$style.active]: !isShowSpoiler }]"
    @click="isShowSpoiler = !isShowSpoiler"
  >
    <slot />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  display: unset;

  & > * {
    transition: all 0.2s linear;
  }


  &.active {
    & > * {
      filter: blur(5px);
    }
  }
}
</style>
z
