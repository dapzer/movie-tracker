<script generic="T" lang="ts" setup>
import MasonryWall from "@yeger/vue-masonry-wall";
import { UiModal } from "~/components/ui/UiModal";

type Variant = "tripleColumns";

interface UiListWithShowMoreProps<T> {
  items: T[];
  itemsToShow: number;
  variant?: Variant;
  title: string;
  columnWidth?: number;
  gap?: number;
  maxColumns?: number;
  triggerClass?: string;
}

const props = withDefaults(defineProps<UiListWithShowMoreProps<T>>(), {
  columnWidth: 300,
  gap: 20,
  maxColumns: 4
});
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.tripleColumns]: props.variant === 'tripleColumns',
    }]"
  >
    <slot
      v-for="item in props.items.slice(0, props.itemsToShow)"
      :item="item"
      name="card"
    />

    <UiModal
      v-if="props.items.length > props.itemsToShow"
      :class="[$style.showMore, props.triggerClass]"
      :title="props.title"
      button-variant="clear"
      is-full-width
    >
      <template #trigger>
        {{ $t("ui.fullList") }}
      </template>
      <template #content>
        <MasonryWall
          :column-width="props.columnWidth"
          :gap="props.gap"
          :items="props.items"
          :max-columns="props.maxColumns"
          :ssr-columns="4"
        >
          <template #default="{ item }">
            <slot
              :is-from-modal="true"
              :item="item"
              name="card"
            />
          </template>
        </MasonryWall>
      </template>
    </UiModal>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  display: grid;
  align-items: flex-start;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: space-between;
  grid-column-gap: 20px;
  width: 100%;

  .showMore {
    @include card();
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    max-height: 265px;
    width: 100%;
    max-width: unset;
    font-size: var(--fs-h2);
  }

  @media screen and (max-width: $bp-md) {
    grid-template-columns: 1fr;
  }
}

.tripleColumns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;

  .showMore {
    max-width: unset;
  }

  @media screen and (max-width: $bp-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: $bp-slg) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
