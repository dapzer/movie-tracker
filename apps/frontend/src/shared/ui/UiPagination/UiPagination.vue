<script lang="ts" setup>

import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from "radix-vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiPaginationItem from "~/shared/ui/UiPagination/UiPaginationItem.vue"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UiPaginationProps {
  totalItems: number;
  pagesOnSides: number;
  itemsPerPage: number;
  getPageHref?: (page: number) => string;
}

const props = defineProps<UiPaginationProps>();
const currentPage = defineModel<number>();

</script>
<template>
  <PaginationRoot
    v-model:page="currentPage"
    :total="props.totalItems"
    :items-per-page="props.itemsPerPage"
    :sibling-count="props.pagesOnSides"
    show-edges
  >
    <PaginationList
      v-slot="{ items }"
      :class="$style.wrapper"
    >
      <PaginationPrev
        :class="$style.prevPage"
        :as="UiButton"
        scheme="default"
      >
        <UiIcon
          :class="$style.arrowIcon"
          name="icon:arrow"
        />
      </PaginationPrev>

      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          :value="page.value"
          :as="UiPaginationItem"
          :is-active="currentPage === page.value"
          :to="props.getPageHref?.(page.value)"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="page.type"
          :index="index"
          :as="UiTypography"
          variant="label"
        >
          &#8230;
        </PaginationEllipsis>
      </template>

      <PaginationNext
        :class="$style.nextPage"
        :as="UiButton"
        scheme="default"
      >
        <UiIcon
          :class="$style.arrowIcon"
          name="icon:arrow"
        />
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;

  a,
  p,
  button {
    color: var(--c-description);
  }

  a,
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;

    &:hover,
    &:focus,
    &:active {
      background-color: var(--c-card-background-hovered);
    }
  }

  .prevPage {
    .arrowIcon {
      width: 12px;
      transform: rotate(90deg);
    }
  }

  .nextPage {
    .arrowIcon {
      width: 12px;
      transform: rotate(-90deg);
    }
  }
}
</style>
