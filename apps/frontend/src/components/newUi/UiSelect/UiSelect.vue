<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import { UiTypography } from "~/components/newUi/UiTypography"

export interface OptionType {
  value: string | number
  label: string | number
}

interface UiSelectProps {
  options: OptionType[]
}

const props = defineProps<UiSelectProps>()
const selectModel = defineModel<OptionType>()
</script>

<template>
  <Multiselect
    v-model="selectModel"
    :options="props.options"
    :searchable="false"
    :allow-empty="false"
    label="label"
    track-by="value"
    close-on-select
  >
    <template #option="{option}">
      <div :class="$style.item">
        <UiTypography>
          {{ option.label }}
        </UiTypography>
      </div>
    </template>
  </Multiselect>
</template>
z
<style module lang="scss">
@import "~/styles/mixins";

.item {
  padding: 6px;
  width: 100%;
  @include ellipsisText;

  &:hover {
    cursor: pointer;
    background: var(--c-card-background-hovered);
  }
}
</style>

<style lang="scss">
@import "~/styles/mixins";

.multiselect {
  .multiselect__tags {
    color: var(--c-text);
    background: var(--c-card-background-hovered);
    border: 1px solid var(--c-stroke);
    padding: 8px 12px;
  }

  .multiselect__input,
  .multiselect__single {
    padding: 0;
    margin: 0;
    background: var(--c-card-background-hovered);
  }

  .multiselect__content-wrapper {
    background: var(--c-card-background);
    padding: 6px;
    border: 1px solid var(--c-stroke);
    border-top: unset;
    border-bottom-right-radius: var(--s-border-radius);
    border-bottom-left-radius: var(--s-border-radius);

    @include scrollbar();
  }

  .multiselect__single {
    font-size: var(--fs-label);
    line-height: var(--lh-label);
  }

  .multiselect__option,
  .multiselect__option:after {
    all: unset;
  }
}

.multiselect,
.multiselect--active {
  .multiselect__select {
    all: unset;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;
    width: 16px;
    cursor: pointer;
    z-index: 1;

    &::before {
      all: unset;
      content: "";
      position: unset;
      margin-top: unset;
      color: #FFFFFF;
      display: block;
      border: unset;
      width: 12px;
      height: 11px;
      box-sizing: border-box;
      background: url('data:image/svg+xml,<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.12881 7.11216L11.5132 1.78957C11.7095 1.59544 11.7114 1.27886 11.5172 1.08247C11.3231 0.886088 11.0065 0.884263 10.8101 1.0784L6.13697 5.69797L1.51739 1.02481C1.32326 0.828423 1.00668 0.826597 0.8103 1.02073C0.613915 1.21486 0.612089 1.53144 0.806222 1.72782L6.12881 7.11216Z" fill="white"/></svg>') no-repeat;
    }
  }
}

.multiselect--active {
  .multiselect__tags {
    border-bottom: unset;
  }

  .multiselect__select {
    transform: translateY(-50%) rotate(180deg);
  }

  .multiselect__option--highlight > div {
    background: var(--c-card-background-hovered);

  }
}

</style>
