<script setup lang="ts">
import type { UserPublicType, UserStatsType } from "@movie-tracker/types"
import UserProfileRatings from "~/features/profile/ui/tabs/UserProfileRatings.vue"

interface Props {
  user: UserPublicType
  stats: UserStatsType
}

const props = defineProps<Props>()
</script>

<template>
  <UserProfileRatings
    :user="props.user"
    :ratings-count="props.stats.mediaRatingsCount"
  />
</template>
