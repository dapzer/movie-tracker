<script setup lang="ts">
import { computed, ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

export interface UiDetailsProps {
  title: string
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<UiDetailsProps>()

const model = defineModel<boolean>()

const visible = ref(model.value ?? false)

const visibleState = computed(() => {
  return model.value ?? visible
})

function handleVisible(value: boolean) {
  visible.value = value
  model.value = value
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-bind="$attrs"
      variant="text"
      :class="[$style.trigger, {
        [$style.active]: visibleState,
      }]"
      @click="handleVisible(!visibleState)"
    >
      {{ props.title }}
      <UiIcon
        :class="$style.icon"
        name="icon:arrow"
      />
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
      .icon {
        transform: rotate(180deg);
      }
    }

    .icon {
      width: 11px;
    }
  }
}
</style>
