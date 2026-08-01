<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import UserProfileReviews from "~/features/profile/ui/tabs/UserProfileReviews.vue"

interface Props {
  user: UserPublicType
}

const props = defineProps<Props>()
</script>

<template>
  <UserProfileReviews :user-id="props.user.id" />
</template>
