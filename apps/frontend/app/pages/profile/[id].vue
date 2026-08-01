<script setup lang="ts">
import type { UserProfileTab } from "~/features/profile/ui/UserProfileContent.vue"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n, useRouteBaseName, useSeoMeta } from "#imports"
import { useRoute } from "#vue-router"
import { FetchError, HttpStatus } from "@movie-tracker/utils"
import { computed } from "vue"
import { useGetUserFollowInformationApi } from "~/api/userFollows/useUserFollowsApi"
import { useGetUserProfileByIdApi, useGetUserStatsByIdApi } from "~/api/users/useUsersApi"
import { UserProfileInfo } from "~/features/profile"
import UserProfileContent from "~/features/profile/ui/UserProfileContent.vue"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getShortText } from "~/shared/utils/getShortText"

const profileRouteTabMap: Record<string, UserProfileTab> = {
  "profile-id": "lists",
  "profile-id-ratings": "ratings",
  "profile-id-reviews": "reviews",
  "profile-id-followers": "followers",
  "profile-id-followings": "followings",
}

const route = useRoute()
const userId = route.params.id as string
const localePath = useLocalePath()
const { t } = useI18n()

const getUserProfileByIdApi = useGetUserProfileByIdApi(userId)
const getUserStatsByIdApi = useGetUserStatsByIdApi(userId)
const getUserFollowInformationApi = useGetUserFollowInformationApi(userId)

await Promise.all([
  getUserProfileByIdApi.suspense(),
  getUserStatsByIdApi.suspense(),
  getUserFollowInformationApi.suspense(),
])

const user = computed(() => getUserProfileByIdApi.data.value)
const stats = computed(() => getUserStatsByIdApi.data.value)
const followInformation = computed(() => getUserFollowInformationApi.data.value)

const getRouteBaseName = useRouteBaseName()

const activeTab = computed<UserProfileTab>(() => {
  const name = getRouteBaseName(route) as string
  return profileRouteTabMap[name] ?? "lists"
})

const title = computed(() => {
  return `${getShortText(user.value?.name, 12)} | ${t(`userProfile.tabs.${activeTab.value}`)} | ${t("userProfile.pageTitle")}`
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
  const error = getUserProfileByIdApi.error.value
  return error instanceof FetchError && error.statusCode === HttpStatus.NOT_FOUND
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
  <template v-else-if="user && followInformation && stats">
    <UserProfileInfo
      :user="user"
      :follow-information="followInformation"
      :stats="stats"
    />
    <UserProfileContent
      :user="user"
      :tab="activeTab"
    >
      <NuxtPage
        :user="user"
        :stats="stats"
        :follow-information="followInformation"
      />
    </UserProfileContent>
  </template>
</template>

<style scoped lang="scss">

</style>
