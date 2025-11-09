<script setup lang="ts">
import { useUserFollow } from "~/entities/userFollow/model/useUserFollow"
import { UiButton } from "~/shared/ui/UiButton"

interface UserFollowButton {
  userId: string
  isFollowing: boolean
}

const props = defineProps<UserFollowButton>()

const { handleFollow, isPending } = useUserFollow()
</script>

<template>
  <UiButton
    size="medium"
    :scheme="props.isFollowing ? 'gray' : 'primary'"
    :disabled="isPending"
    @click="handleFollow({
      userId: props.userId,
      isFollowing: props.isFollowing,
    })"
  >
    {{ props.isFollowing ? $t("ui.unfollow") : $t("ui.follow") }}
  </UiButton>
</template>

<style scoped lang="scss">

</style>
