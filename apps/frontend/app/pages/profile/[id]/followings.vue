<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import UserProfileFollowings from "~/features/profile/ui/tabs/UserProfileFollowings.vue"

interface Props {
  user: UserPublicType
}

const props = defineProps<Props>()
</script>

<template>
  <UserProfileFollowings :user="props.user" />
</template>
