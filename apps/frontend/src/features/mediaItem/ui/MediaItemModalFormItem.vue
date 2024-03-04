<script lang="ts" setup>
import { type MediaListType } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiCheckbox from "~/components/ui/UiCheckbox.vue";

interface MediaItemModalFormItemProps {
  list: MediaListType;
  disabled?: boolean
  asRadioInput?: boolean
}

const props = defineProps<MediaItemModalFormItemProps>();
const inputModel = defineModel();

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="$style.title"
      variant="title3"
    >
      {{ props.list.title ?? $t('mediaList.favorites') }}
    </UiTypography>
    <UiCheckbox
      v-model="inputModel"
      :as-radio-input="props.asRadioInput"
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
