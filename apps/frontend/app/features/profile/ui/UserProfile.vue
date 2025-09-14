<script setup lang="ts">
import { useGetUserProfileByIdApi, useGetUserStatsByIdApi } from "~/api/user/useUserApi"
import UserProfileInfo from "~/features/profile/ui/UserProfileInfo.vue"

interface UserProfileProps {
  userId: string
}

const props = defineProps<UserProfileProps>()
// TODO: handle error
const getUserProfileByIdApi = useGetUserProfileByIdApi(props.userId)
const getUserStatsByIdApi = useGetUserStatsByIdApi(props.userId)

await Promise.all([
  getUserProfileByIdApi.suspense(),
  getUserStatsByIdApi.suspense(),
])
</script>

<template>
  <UserProfileInfo
    v-if="getUserProfileByIdApi.data.value && getUserStatsByIdApi.data.value"
    :user="getUserProfileByIdApi.data.value"
    :stats="getUserStatsByIdApi.data.value"
  />
</template>

<style scoped lang="scss">

</style>
