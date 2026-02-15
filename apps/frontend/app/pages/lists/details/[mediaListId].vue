<script lang="ts" setup>
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useGetMediaListByIdApi } from "~/api/mediaList/useMediaListApi"
import { useSendMediaListViewApi } from "~/api/mediaListView/useMediaListViewApi"
import { useGetUserProfileByIdApi } from "~/api/user/useUserApi"
import { useAuth } from "~/shared/composables/useAuth"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"
import { checkIsAuthError } from "~/shared/utils/checkIsAuthError"
import { getShortText } from "~/shared/utils/getShortText"
import { MediaListDetails } from "~/widgets/mediaList"

const { t } = useI18n()
const route = useRoute()
const mediaListHumanFriendlyId = route.params.mediaListId

const localePath = useLocalePath()
const { isInitialLoadingProfile, profile, isAuthorized } = useAuth()

const sendMediaListViewApi = useSendMediaListViewApi()
const getMediaListByIdApi = useGetMediaListByIdApi(mediaListHumanFriendlyId as string, {
  retry: false,
  retryOnMount: false,
})
await getMediaListByIdApi.suspense()

const isUserListOwner = computed(() => {
  return getMediaListByIdApi.data.value?.userId === profile.value?.id
})

const externalUserId = computed(() => {
  if (isUserListOwner.value) {
    return undefined
  }
  return getMediaListByIdApi.data.value?.userId
})

const externalUserProfileApi = useGetUserProfileByIdApi(externalUserId.value!, {
  enabled: !!externalUserId.value,
  retry: false,
})

if (externalUserId.value) {
  await externalUserProfileApi.suspense()
}

const isNotPublicList = computed(() => {
  return getMediaListByIdApi.error.value && checkIsAuthError(getMediaListByIdApi.error.value)
})

const currentMediaList = computed(() => {
  return getMediaListByIdApi.data.value
})

const currentUserProfile = computed(() => {
  return isUserListOwner.value ? profile.value : externalUserProfileApi.data.value
})

if (isAuthorized.value && !isNotPublicList.value && !isUserListOwner.value && currentMediaList.value && import.meta.client) {
  sendMediaListViewApi.mutateAsync(currentMediaList.value.id)
}

const isLoading = computed(() => {
  const isLoadingMediaList = getMediaListByIdApi.isLoading.value
  const isLoadingProfiles = isInitialLoadingProfile.value || externalUserProfileApi.isLoading.value

  return isLoadingMediaList || isLoadingProfiles
})

const title = computed(() => {
  return t("mediaList.listPageTitle", {
    title: getShortText(currentMediaList?.value?.title, 12)
      || t("mediaList.favorites"),
  })
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${title.value} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${title.value}`
  },
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiAttention
      v-if="isNotPublicList || !currentMediaList && !isLoading"
      :title="$t('mediaList.noPermission')"
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
    <MediaListDetails
      v-else
      :user-profile="currentUserProfile"
      :is-user-list-owner="isUserListOwner"
      :media-list="currentMediaList"
    />
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
