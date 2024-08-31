<script setup lang="ts">

import { UiCardsGrid } from "~/components/newUi/UiCardsGrid"
import { UiDivider } from "~/components/newUi/UiDivider"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiContainer } from "~/components/newUi/UiContainer"
import { UiPagination } from "~/components/newUi/UiPagination"
import { UiBackLink } from "~/components/newUi/UiBackLink"

interface ContentListProps {
  title: string;
  backButtonText?: string;
  backButtonUrl: string;
  totalPages: number;
}

const props = defineProps<ContentListProps>()
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

    <template v-if="props.totalPages >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="20"
        :total-pages="props.totalPages"
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
