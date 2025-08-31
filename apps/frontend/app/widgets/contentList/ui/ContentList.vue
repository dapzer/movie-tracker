<script setup lang="ts">
import { UiBackLink } from "~/shared/ui/UiBackLink"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTypography } from "~/shared/ui/UiTypography"

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
    <div :class="$style.header">
      <UiBackLink
        :url="props.backButtonUrl"
        :text="props.backButtonText"
      />
      <UiTypography
        as="h1"
        variant="title"
      >
        {{ props.title }}
      </UiTypography>
    </div>
    <UiDivider :class="$style.divider" />

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
  }

  .content {
    margin-top: 16px;
    margin-bottom: 30px;
  }
}
</style>
