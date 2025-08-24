<script setup lang="ts">
import { MediaListAccessLevelEnum } from "@movie-tracker/types"
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import UiListsGrid from "~/shared/ui/UiListsGrid/UiListsGrid.vue"
import UiListsGridVertical from "~/shared/ui/UiListsGrid/UiListsGridVertical.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"

const data = Array.from({ length: 20 }).fill({
  id: crypto.randomUUID(),
  title: "Title",
  description: "Description",
  user: {
    id: crypto.randomUUID(),
    name: "UserName",
    avatarUrl: getPlaceholderImageUrl(32, 32),
    url: "/",
  },
  poster: Array.from({ length: 6 }).fill(getPlaceholderImageUrl(179, 277)),
  accessLevel: MediaListAccessLevelEnum.PUBLIC,
}) as {
  id: string
  title: string
  description: string
  user: {
    id: string
    name: string
    avatarUrl: string
    url: string
  }
  poster: string[]
  accessLevel: MediaListAccessLevelEnum
}[]
</script>

<template>
  <Story
    title="UiListsGrid"
    group="ui-kit"
  >
    <template #default>
      <Variant
        title="Base"
      >
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
      </Variant>
      <Variant
        title="Vertical"
      >
        <UiListsGridVertical :items="data">
          <template #default="{ item }">
            <UiListCard
              :key="item.id"
              :user-avatar-src="item.user.avatarUrl"
              :images-src="item.poster"
              :user-name="item.user.name"
              :user-url="item.user.url"
            >
              <UiTypography variant="listTitle">
                {{ item.title }}
              </UiTypography>
            </UiListCard>
          </template>
        </UiListsGridVertical>
      </Variant>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
