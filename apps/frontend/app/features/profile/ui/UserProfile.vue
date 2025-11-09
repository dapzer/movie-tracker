<script setup lang="ts">
import type { FetchError } from "@movie-tracker/utils"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { HttpStatus } from "@movie-tracker/utils"
import { computed } from "vue"
import { useGetUserProfileByIdApi, useGetUserStatsByIdApi } from "~/api/user/useUserApi"
import { useGetUserFollowInformationApi } from "~/api/userFollow/useUserFollowApi"
import UserProfileContent from "~/features/profile/ui/UserProfileContent.vue"
import UserProfileInfo from "~/features/profile/ui/UserProfileInfo.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getShortText } from "~/shared/utils/getShortText"
import UiAttention from "../../../shared/ui/UiAttention/UiAttention.vue"

interface UserProfileProps {
  userId: string
}

const props = defineProps<UserProfileProps>()

const { t } = useI18n()
const localePath = useLocalePath()

const getUserProfileByIdApi = useGetUserProfileByIdApi(props.userId)
const getUserStatsByIdApi = useGetUserStatsByIdApi(props.userId)
const getUserFollowInformationApi = useGetUserFollowInformationApi(props.userId)

await Promise.all([
  getUserProfileByIdApi.suspense(),
  getUserStatsByIdApi.suspense(),
  getUserFollowInformationApi.suspense(),
])

const title = computed(() => {
  return `${getShortText(getUserProfileByIdApi.data.value?.name, 12)} | ${t("userProfile.pageTitle")}`
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${title.value} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${title.value}`
  },
})

const notFound = computed(() => {
  return (getUserProfileByIdApi.error.value as FetchError)?.statusCode === HttpStatus.NOT_FOUND
})
</script>

<template>
  <UiAttention
    v-if="notFound"
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
  <template v-else-if="getUserProfileByIdApi.data.value && getUserStatsByIdApi.data.value && getUserFollowInformationApi.data.value">
    <UserProfileInfo
      :user="getUserProfileByIdApi.data.value"
      :follow-information="getUserFollowInformationApi.data.value"
      :stats="getUserStatsByIdApi.data.value"
    />
    <UserProfileContent
      :user="getUserProfileByIdApi.data.value"
      :follow-information="getUserFollowInformationApi.data.value"
    />
  </template>
</template>

<style scoped lang="scss">

</style>
