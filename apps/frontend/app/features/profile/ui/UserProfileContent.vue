<script setup lang="ts">
import type { UserFollowInformationType, UserPublicType, UserStatsType } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import UserProfileFollowers from "~/features/profile/ui/tabs/UserProfileFollowers.vue"
import UserProfileFollowings from "~/features/profile/ui/tabs/UserProfileFollowings.vue"
import UserProfileLists from "~/features/profile/ui/tabs/UserProfileLists.vue"
import UserProfileRatings from "~/features/profile/ui/tabs/UserProfileRatings.vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTabs } from "~/shared/ui/UiTabs"

interface UserProfileContentProps {
  user: UserPublicType
  followInformation: UserFollowInformationType
  stats: UserStatsType
}

const props = defineProps<UserProfileContentProps>()

const activeTab = useRouteQuery<string>("tab", "lists", {
  mode: "replace",
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTabs
      v-model="activeTab"
      :tabs="[
        {
          key: 'lists',
          label: $t('userProfile.tabs.lists'),
        },
        {
          key: 'ratings',
          label: $t('userProfile.tabs.ratings'),
        },
        {
          key: 'followers',
          label: $t('userProfile.tabs.followers'),
        },
        {
          key: 'followings',
          label: $t('userProfile.tabs.followings'),
        },
      ] as const"
    >
      <template #lists>
        <UserProfileLists
          :user-id="props.user.id"
          :lists-count="props.stats.mediaListCount"
        />
      </template>
      <template #ratings>
        <UserProfileRatings
          :user="props.user"
          :ratings-count="props.stats.mediaRatingsCount"
        />
      </template>
      <template #followers>
        <UserProfileFollowers
          :user="props.user"
          :follow-information="props.followInformation"
        />
      </template>
      <template #followings>
        <UserProfileFollowings :user="props.user" />
      </template>
    </UiTabs>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 32px;
}
</style>
