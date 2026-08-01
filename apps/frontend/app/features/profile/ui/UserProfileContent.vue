<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTabsPane } from "~/shared/ui/UiTabs"

export type UserProfileTab = "lists" | "ratings" | "reviews" | "followers" | "followings"

interface UserProfileContentProps {
  user: UserPublicType
  tab: UserProfileTab
}

const props = defineProps<UserProfileContentProps>()

const localePath = useLocalePath()
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTabsPane
      :model-value="props.tab"
      :tabs="[
        {
          key: 'lists',
          label: $t('userProfile.tabs.lists'),
          href: localePath(`/profile/${props.user.id}`)
        },
        {
          key: 'ratings',
          label: $t('userProfile.tabs.ratings'),
          href: localePath(`/profile/${props.user.id}/ratings`)
        },
        {
          key: 'reviews',
          label: $t('userProfile.tabs.reviews'),
          href: localePath(`/profile/${props.user.id}/reviews`)
        },
        {
          key: 'followers',
          label: $t('userProfile.tabs.followers'),
          href: localePath(`/profile/${props.user.id}/followers`)
        },
        {
          key: 'followings',
          label: $t('userProfile.tabs.followings'),
          href: localePath(`/profile/${props.user.id}/followings`)
        },
      ] as const"
    >
      <template #content>
        <slot />
      </template>
    </UiTabsPane>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 32px;
}
</style>
