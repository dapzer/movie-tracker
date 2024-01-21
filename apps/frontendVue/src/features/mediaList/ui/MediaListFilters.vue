<script lang="ts" setup>

import UiInput from "~/components/ui/UiInput.vue";
import { ref } from "vue";
import { watch } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";
import { mediaListSortingOptions, type MediaListSortingOptionType } from "~/features/mediaList";

const currentSortModel = defineModel<MediaListSortingOptionType>("sortModel");
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
    <div :class="$style.item">
      <UiTypography
        variant="title4"
      >
        {{ $t("search.placeholder") }}:
      </UiTypography>
      <UiInput
        v-model="localSearchValue"
        :is-show-clear-button="!!localSearchValue"
        :placeholder="$t('search.mediaPlaceholder')"
        variant="underlined"
        @on-click-clear="clearSearch"
      />
    </div>

    <div :class="$style.item">
      <UiTypography
        variant="title4"
      >
        {{ $t("mediaList.sort.title") }}:
      </UiTypography>
      <div :class="$style.selectWrapper">
        <select v-model="currentSortModel">
          <option
            v-for="option in mediaListSortingOptions"
            :key="option.translationKey"
            :value="option"
          >
            {{ $t(option.translationKey) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .item {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    max-width: 350px;

    .selectWrapper {
      border-bottom: 1px solid var(--c-text);

      select {
        background: none;
        color: var(--c-secondary);
        width: 100%;
        padding: 10px 16px;
        border: none;
        border-right: 16px solid transparent;

        option {
          color: #000;
        }
      }
    }
  }
}
</style>
