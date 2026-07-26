<script setup lang="ts">
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiPagination } from "~/shared/ui/UiPagination"
import ContentListHeader from "~/widgets/contentList/ui/ContentListHeader.vue"

interface ContentListProps {
  title: string
  backButtonText?: string
  backButtonUrl: string
  totalPages: number
  getPageHref?: (page: number) => string
}

const props = defineProps<ContentListProps>()
const slots = defineSlots()
const currentPage = defineModel<number>("currentPage")
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <ContentListHeader
      :title="props.title"
      :back-button-text="props.backButtonText"
      :back-button-url="props.backButtonUrl"
    />

    <UiCardsGrid :class="$style.content">
      <slot />
    </UiCardsGrid>

    <template v-if="slots.plainContent">
      <div :class="$style.content">
        <slot name="plainContent" />
      </div>
    </template>

    <template v-if="props.totalPages >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="20"
        :total-items="props.totalPages * 20"
        :get-page-href="props.getPageHref"
      />
    </template>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  padding-top: 24px !important;

  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .divider {
    margin-top: 20px;
    margin-bottom: 16px;
  }

  .content {
    margin-bottom: 30px;
  }
}
</style>
