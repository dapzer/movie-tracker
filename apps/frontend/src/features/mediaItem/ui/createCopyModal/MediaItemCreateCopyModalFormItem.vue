<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiCheckbox from "~/components/ui/UiCheckbox.vue";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";

interface MediaItemCreateCopyModalFormItemProps {
  status: MediaItemStatusNameEnum;
  disabled?: boolean;
}

const props = defineProps<MediaItemCreateCopyModalFormItemProps>();
const inputModel = defineModel<MediaItemStatusNameEnum[]>();

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="$style.title"
      variant="title3"
    >
      {{ $t(`mediaItem.status.${props.status}`) }}
    </UiTypography>
    <UiCheckbox
      v-model="inputModel"
      :disabled="props.disabled"
      :value="props.status"
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
