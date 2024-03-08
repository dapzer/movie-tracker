<script lang="ts" setup>
import { ref } from "vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import { ArrowIcon } from "~/components/ui/icons";

interface UiDetailsProps {
  description?: string;
  title: string;
  isOpenedDefault?: boolean;
  isLarge?: boolean;
}

const props = defineProps<UiDetailsProps>();
const emmit = defineEmits<{
  (e: "onHandleState", value: boolean): void;
}>();

const isOpened = ref(props.isOpenedDefault ?? false);

const handleOpen = () => {
  isOpened.value = !isOpened.value;
  emmit("onHandleState", isOpened.value);
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :class="[$style.toggler, {
        [$style.togglerLarge]: props.isLarge,
      }]"
      variant="clear"
      @click="handleOpen"
    >
      <div :class="$style.info">
        <UiTypography :class="$style.title">
          {{ props.title }}
        </UiTypography>
        <UiTypography
          v-if="props.description"
          :class="$style.description"
        >
          {{ props.description }}
        </UiTypography>
      </div>

      <div
        :class="[$style.arrow, {
          [$style.arrowActive]: isOpened
        }]"
      >
        <ArrowIcon />
      </div>
    </UiButton>

    <div v-if="isOpened">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .toggler {
    border: 1px solid var(--c-text);
    padding: 10px 16px;
    text-align: left;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: center;
    font-size: var(--fs-span);

    .info {
      display: flex;
      gap: 10px;
      align-items: center;

      .title {
        font-size: var(--fs-span);
        color: inherit;
      }

      .description {
        font-size: var(--fs-span);
      }

      @media screen and (max-width: calc($bp-sm + 100px)) {
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
      }
    }

    &:hover {
      color: var(--c-secondary);
      border-color: var(--c-text);
    }

    .arrow {
      rotate: 180deg;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;

      &Active {
        rotate: 0deg;
      }
    }

    &Large {
      border: none;
      border-bottom: 2px solid var(--c-text);
      position: sticky;
      z-index: var(--i-ui-details);
      justify-content: space-between;
      top: var(--s-header-height);
      @include fullWidthBg(var(--c-background));

      .info {
        .title {
          font-size: var(--fs-p);
        }
      }

      @media screen and (min-width: $bp-sm) {
        .arrow {
          width: 24px;
          height: 24px;
        }

        .info {
          .title {
            font-size: var(--fs-h3);
          }
        }
      }
    }
  }
}
</style>
