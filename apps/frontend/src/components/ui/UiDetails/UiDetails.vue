<script setup lang="ts">
import { computed, ref } from "vue"
import { UiButton } from "~/components/ui/UiButton"
import { ArrowIcon } from "~/components/ui/icons"

export interface UiDetailsProps {
  title: string
}

const props = defineProps<UiDetailsProps>()

const model = defineModel<boolean>()

const visible = ref(model.value ?? false)

const visibleState = computed(() => {
  return model.value ?? visible
})

const handleVisible = (value: boolean) => {
  visible.value = value
  model.value = value
}

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-bind="$attrs"
      variant="text"
      :class="[$style.trigger, {
        [$style.active]: visibleState
      }]"
      @click="handleVisible(!visibleState)"
    >
      {{ props.title }}
      <ArrowIcon />
    </UiButton>

    <div v-if="visibleState">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;

    &.active {
      svg {
        transform: rotate(180deg);
      }
    }

    svg {
      width: 11px;
    }
  }
}
</style>
