<script setup lang="ts">
import type { UserPublicType, UserStatsType } from "@movie-tracker/types"
import UserProfileLists from "~/features/profile/ui/tabs/UserProfileLists.vue"

interface Props {
  user: UserPublicType
  stats: UserStatsType
}

const props = defineProps<Props>()
</script>

<template>
  <UserProfileLists
    :user-id="props.user.id"
    :lists-count="props.stats.mediaListCount"
  />
</template>
