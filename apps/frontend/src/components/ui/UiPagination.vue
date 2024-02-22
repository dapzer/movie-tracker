<script lang="ts" setup>
import UiButton from "~/components/ui/UiButton.vue";
import { computed, watch } from "#imports";
import { ref } from "vue";

interface UiPaginationProps {
  currentPage: number;
  totalPages: number;
  options: {
    pageToShow: number;
    pagesOnSides: number;
  };
}

const props = defineProps<UiPaginationProps>();
const emits = defineEmits<{
  (e: "changePage", page: number): void
}>();

const startPoint = ref(1);
const endPoint = ref(1);

const generateRange = (startPoint: number, endPoint: number) => {
  let pages: number[] = [];

  for (let i = startPoint; i <= endPoint; i++) {
    pages.push(i);
  }

  return pages;
};

const pages = computed(() => {
  return generateRange(startPoint.value, endPoint.value);
});

const isLastPages = computed(() => {
  return props.currentPage + props.options.pageToShow - props.options.pagesOnSides >= props.totalPages;
});

const isFirstPages = computed(() => {
  return props.currentPage < props.options.pageToShow - props.options.pagesOnSides;
});

const isSmallerToShow = computed(() => {
  return props.options.pageToShow >= props.totalPages;
});

const isShowToBegin = computed(() => {
  return (props.currentPage > props.options.pageToShow);
});

const isShowToEnd = computed(() => {
  return (props.totalPages - props.options.pagesOnSides > props.currentPage);
});

watch([() => props.currentPage, () => props.totalPages], () => {
  if (isSmallerToShow.value) {
    startPoint.value = 1;
    endPoint.value = props.totalPages;
    return;
  }

  if (isFirstPages.value) {
    startPoint.value = 1;
    endPoint.value = props.options.pageToShow;
    return;
  }

  if (isLastPages.value) {
    startPoint.value = props.totalPages - props.options.pageToShow + 1;
    endPoint.value = props.totalPages;
    return;
  }

  startPoint.value = props.currentPage - props.options.pagesOnSides;
  endPoint.value = props.currentPage + (props.options.pageToShow - props.options.pagesOnSides - 1);
}, { immediate: true });
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-if="isShowToBegin"
      @click="emits('changePage', 1)"
    >
      {{ $t("ui.pagination.toStart") }}
    </UiButton>

    <div :class="$style.pages">
      <UiButton
        v-for="page in pages"
        :key="page"
        :class="{ [$style.active]: page === currentPage }"
        @click="emits('changePage', page)"
      >
        {{ page }}
      </UiButton>
    </div>

    <UiButton
      v-if="isShowToEnd"
      @click="emits('changePage', totalPages)"
    >
      {{ $t("ui.pagination.toEnd") }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;

  .pages {
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  button {
    padding: 10px;
    border-radius: var(--s-border-radius);

    &:hover:not(:disabled) {
      background-color: var(--c-highlight);
      color: var(--c-secondary);
    }
  }

  .active {
    background-color: var(--c-highlight);
  }
}
</style>
