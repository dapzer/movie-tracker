<script setup lang="ts">
import type { UserFollowInformationType, UserPublicType } from "@movie-tracker/types"
import UserProfileFollowers from "~/features/profile/ui/tabs/UserProfileFollowers.vue"

interface Props {
  user: UserPublicType
  followInformation: UserFollowInformationType
}

const props = defineProps<Props>()
</script>

<template>
  <UserProfileFollowers
    :user="props.user"
    :follow-information="props.followInformation"
  />
</template>
