<script setup lang="ts">
import type { UserPublicType, UserStatsType } from "@movie-tracker/types"
import UserProfileAbout from "~/features/profile/ui/UserProfileAbout.vue"
import UserProfileStats from "~/features/profile/ui/UserProfileStats.vue"
import { UiContainer } from "~/shared/ui/UiContainer"

interface UserProfileInfoProps {
  user: UserPublicType
  stats: UserStatsType
}

const props = defineProps<UserProfileInfoProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <UiContainer :class="$style.content">
      <UserProfileAbout :user="props.user" />
      <UserProfileStats :stats="stats" />
    </UiContainer>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  background: var(--c-profile-background-gradient);
}

.content {
  padding-top: 32px;
  padding-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  @include mobileDevice() {
    flex-direction: column;
    align-items: flex-start;
    padding-top: 24px;
    padding-bottom: 24px;
  }
}
</style>
