<script lang="ts" setup>

import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from "radix-vue"
import { UiButton } from "~/components/newUi/UiButton"
import { ArrowIcon } from "~/components/ui/icons"
import { UiTypography } from "~/components/newUi/UiTypography"

interface UiPaginationProps {
  totalPages: number;
  pagesOnSides: number;
  itemsPerPage: number;
}

const props = defineProps<UiPaginationProps>();
const currentPage = defineModel<number>();

</script>
<template>
  <PaginationRoot
    v-model:page="currentPage"
    :total="props.totalPages"
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
        <ArrowIcon />
      </PaginationPrev>

      <template v-for="(page, index) in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          :key="index"
          :class="{ [$style.page]: currentPage === page.value }"
          :value="page.value"
          :as="UiButton"
          :scheme="currentPage === page.value ? 'secondary': 'default'"
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
        <ArrowIcon />
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

  p,
  button {
    color: var(--c-description);
  }

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
    svg {
      width: 12px;
      transform: rotate(90deg);
    }
  }

  .nextPage {
    svg {
      width: 12px;
      transform: rotate(-90deg);
    }
  }
}
</style>
