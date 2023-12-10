<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div :class="$style.wrapper">
    <slot name="trigger" />
    <div :class="$style.contentWrapper">
      <div
        v-bind="$attrs"
        :class="[$style.content]"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  position: relative;
  cursor: pointer;

  &:hover {
    .contentWrapper {
      display: flex;
    }
  }
}

.contentWrapper {
  display: none;
  right: 0;
  z-index: var(--i-dropdown);
  position: absolute;
  width: max-content;
  cursor: auto;
}

.content {
  display: flex;
  box-shadow: 0 0 20px rgb(0 0 0 / 20%);
  padding: 16px 10px;
  background: var(--c-accent);
  max-width: max-content;
  margin-top: 10px;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: unset;
}
</style>
