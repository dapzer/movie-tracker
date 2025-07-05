<script setup lang="ts">
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import UiListsGrid from "~/shared/ui/UiListsGrid/UiListsGrid.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"
</script>

<template>
  <Story
    title="UiListsGrid"
    group="ui-kit"
  >
    <template #default>
      <UiListsGrid>
        <UiListCard
          v-for="i in 20"
          :key="i"
          :user-avatar-src="getPlaceholderImageUrl(32, 32)"
          :images-src="Array(6).fill(0).map((_, i) => i).map((_, i) => getPlaceholderImageUrl(179, 277))"
          user-name="UserName"
          user-url="/"
        >
          <UiTypography variant="listTitle">
            Title
          </UiTypography>
        </UiListCard>
      </UiListsGrid>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
