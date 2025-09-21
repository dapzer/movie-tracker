<script setup lang="ts">
import type { FetchError } from "@movie-tracker/utils"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useGetUserProfileByIdApi, useGetUserStatsByIdApi } from "~/api/user/useUserApi"
import UserProfileContent from "~/features/profile/ui/UserProfileContent.vue"
import UserProfileInfo from "~/features/profile/ui/UserProfileInfo.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiAttention from "../../../shared/ui/UiAttention/UiAttention.vue"

interface UserProfileProps {
  userId: string
}

const props = defineProps<UserProfileProps>()

const localePath = useLocalePath()

const getUserProfileByIdApi = useGetUserProfileByIdApi(props.userId)
const getUserStatsByIdApi = useGetUserStatsByIdApi(props.userId)

await Promise.all([
  getUserProfileByIdApi.suspense(),
  getUserStatsByIdApi.suspense(),
])
</script>

<template>
  <UiAttention
    v-if="(getUserProfileByIdApi.error.value as FetchError)?.statusCode === 404"
    :title="$t('userProfile.notFound')"
  >
    <UiTypography
      :to="localePath('/')"
      variant="label"
      :as="NuxtLink"
      schema="link"
    >
      {{ $t('ui.actions.backToMainPage') }}
    </UiTypography>
  </UiAttention>
  <template v-else-if="getUserProfileByIdApi.data.value && getUserStatsByIdApi.data.value">
    <UserProfileInfo
      :user="getUserProfileByIdApi.data.value"
      :stats="getUserStatsByIdApi.data.value"
    />
    <UserProfileContent :user="getUserProfileByIdApi.data.value" />
  </template>
</template>

<style scoped lang="scss">

</style>
