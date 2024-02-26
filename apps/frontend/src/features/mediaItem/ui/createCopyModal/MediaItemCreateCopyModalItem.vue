<script lang="ts" setup>
import { type MediaListType } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiCheckbox from "~/components/ui/UiCheckbox.vue";

interface MediaItemCreateCopyModalItemProps {
  list: MediaListType;
  disabled?: boolean
}

const props = defineProps<MediaItemCreateCopyModalItemProps>();
const inputModel = defineModel();

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="$style.title"
      variant="title3"
    >
      {{ props.list.title }}
    </UiTypography>
    <UiCheckbox
      v-model="inputModel"
      :disabled="props.disabled"
      :value="list.id"
    />
  </div>
</template>

<style lang="scss" module>
@import "~/styles/mixins";

.wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  .title {
    @include ellipsisText;
  }
}
</style>
