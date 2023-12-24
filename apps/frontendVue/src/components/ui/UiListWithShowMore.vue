<script generic="T" lang="ts" setup>
import MasonryWall from "@yeger/vue-masonry-wall";
import { UiModal } from "~/components/ui/UiModal";
import UiTypography from "~/components/ui/UiTypography.vue";

interface UiListWithShowMoreProps<T> {
  items: T[];
  itemsToShow: number;
  title: string;
  columnWidth?: number;
  gap?: number;
  maxColumns?: number;
  triggerClass?: string;
}

const props = withDefaults(defineProps<UiListWithShowMoreProps<T>>(),{
  columnWidth: 300,
  gap: 20,
  maxColumns: 4
})
</script>

<template>
  <div :class="$style.wrapper">
    <slot
      v-for="item in props.items.slice(0, props.itemsToShow)"
      :item="item"
      name="card"
    />

    <UiModal
      :class="[$style.showMore, props.triggerClass]"
      :title="props.title"
      button-variant="clear"
      is-full-width
    >
      <template #trigger>
        {{ $t('ui.fullList') }}
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
              :item="item"
              :is-from-modal="true"
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
    height: 275px;
    width: 100%;
    max-width: 300px;
    font-size: var(--fs-h2);
  }

  @media screen and (max-width: $bp-md) {
    grid-template-columns: 1fr;
  }
}
</style>
