<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import UserProfileLists from "~/features/profile/ui/tabs/UserProfileLists.vue"
import UserProfileRatings from "~/features/profile/ui/tabs/UserProfileRatings.vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTabs } from "~/shared/ui/UiTabs"

interface UserProfileContentProps {
  user: UserPublicType
}

const props = defineProps<UserProfileContentProps>()
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTabs
      :tabs="[{
        key: 'lists',
        label: $t('userProfile.tabs.lists'),
      }, {
        key: 'ratings',
        label: $t('userProfile.tabs.ratings'),
      }] as const"
    >
      <template #lists>
        <UserProfileLists :user-id="props.user.id" />
      </template>
      <template #ratings>
        <UserProfileRatings :user="props.user" />
      </template>
    </UiTabs>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 32px;
}
</style>
