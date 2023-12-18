<script lang="ts" setup>
import UiCardBase from "~/components/ui/UiCard/UiCardBase.vue";
import UiSkeleton from "~/components/ui/UiSkeleton.vue";
import { computed } from "#imports";

interface UiCardProps {
  posterHeight?: number;
  width?: number;
  isHorizontal?: boolean;
  isSmall?: boolean;
}

const props = defineProps<UiCardProps>();

const posterHeightBySize = computed(() => {
  if (props.posterHeight) {
    return props.posterHeight;
  } else if (props.isSmall) {
    return 240;
  } else if (props.isHorizontal) {
    return 224;
  } else {
    return 390;
  }
});
</script>

<template>
  <UiCardBase
    :isHorizontal="props?.isHorizontal"
    :isSmall="props?.isSmall"
    :width="props?.width"
  >
    <template #image>
      <UiSkeleton :height="posterHeightBySize" />
    </template>
    <template #description>
      <UiSkeleton :width="100" />
    </template>
    <template #title>
      <UiSkeleton
        :class="$style.title"
        :width="150"
      />
    </template>
    <slot />
  </UiCardBase>
</template>

<style lang="scss" module>
.title {
  margin-top: 6px;
}
</style>
