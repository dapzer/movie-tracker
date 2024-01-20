<script lang="ts" setup>

import UiInput from "~/components/ui/UiInput.vue";
import { ref } from "vue";
import { watch } from "#imports";
import { CloseIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import UiTypography from "~/components/ui/UiTypography.vue";

// const searchModel = defineModel</**/string>("search");
const emits = defineEmits<{
  (e: "onChangeSearchValue", value: string): void
}>();

const localSearchValue = ref<string>("");

watch(() => localSearchValue.value, (value, oldValue, onCleanup) => {
  const timeout = setTimeout(() => {
    emits("onChangeSearchValue", value);
  }, 500);

  onCleanup(() => clearTimeout(timeout));
});

const clearSearch = () => {
  localSearchValue.value = "";
  emits("onChangeSearchValue", "");
};
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.search">
      <UiTypography
        variant="title4"
      >
        {{ $t("search.placeholder") }}:
      </UiTypography>
      <UiInput
        v-model="localSearchValue"
        variant="underlined"
        :placeholder="$t('search.mediaPlaceholder')"
        :is-show-clear-button="!!localSearchValue"
        @on-click-clear="clearSearch"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;

  .search {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    max-width: 350px;
  }
}
</style>
