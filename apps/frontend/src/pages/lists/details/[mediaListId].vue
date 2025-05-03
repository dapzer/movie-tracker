<script lang="ts" setup>
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { computed, watch } from "vue"
import { useRoute } from "vue-router"
import { useGetMediaItemsApi, useGetMediaItemsByMediaListIdApi } from "~/api/mediaItem/useMediaItemtApi"
import { useGetMediaListsApi, useGetMediaListsByIdApi } from "~/api/mediaList/useMediaListApi"
import { useGetUserProfileByIdApi } from "~/api/user/useUserApi"
import { useAuth } from "~/shared/composables/useAuth"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"
import { checkIsAuthError } from "~/shared/utils/checkIsAuthError"
import { getShortText } from "~/shared/utils/getShortText"
import { MediaListDetails } from "~/widgets/mediaList"

const { t } = useI18n()
const { mediaListId: mediaListHumanFriendlyId = "" } = useRoute().params
const localePath = useLocalePath()
const { isInitialLoadingProfile, profile } = useAuth()

const mediaListsApi = useGetMediaListsApi()
const mediaItemsApi = useGetMediaItemsApi()

const isUserListOwner = computed(() => {
  return !!mediaListsApi.data.value?.some(list => list.humanFriendlyId === mediaListHumanFriendlyId)
})

const isUseExternalData = computed(() => {
  return !isUserListOwner.value && !(mediaListsApi.isPending.value && mediaListsApi.errorUpdateCount.value === 0) && !isInitialLoadingProfile.value
})

const externalMediaListApi = useGetMediaListsByIdApi(mediaListHumanFriendlyId as string, {
  enabled: isUseExternalData.value,
  retry: false,
})

const externalMediaItemsApi = useGetMediaItemsByMediaListIdApi(mediaListHumanFriendlyId as
    string, {
  enabled: isUseExternalData.value,
  retry: false,
})

if (isUseExternalData.value) {
  await Promise.all([
    externalMediaListApi.suspense(),
    externalMediaItemsApi.suspense(),
  ])
}
const externalUserId = computed(() => {
  return externalMediaListApi.data.value?.userId
})

const externalUserProfileApi = useGetUserProfileByIdApi(externalUserId.value!, {
  enabled: !!externalUserId.value,
  retry: false,
})

if (externalUserId.value) {
  await externalUserProfileApi.suspense()
}

watch(isUseExternalData, (value) => {
  if (value) {
    externalMediaListApi.refetch().then(() => {
      externalUserProfileApi.refetch()
    })
    externalMediaItemsApi.refetch()
  }
})

const isNotPublicList = computed(() => {
  return externalMediaListApi.error.value && checkIsAuthError(externalMediaListApi.error.value)
})

const currentMediaList = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaListApi.data.value
  }

  return mediaListsApi.data.value?.find(list => list.humanFriendlyId === mediaListHumanFriendlyId)
})

const currentMediaItems = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaItemsApi.data.value
  }

  return mediaItemsApi.data.value?.filter(item => item.mediaListId === currentMediaList.value?.id)
})

const currentUserProfile = computed(() => {
  return isUserListOwner.value ? profile.value : externalUserProfileApi.data.value
})

const isLoading = computed(() => {
  const isLoadingMediaItems = externalMediaItemsApi.isLoading.value || mediaItemsApi.isLoading.value
  const isLoadingMediaList = externalMediaListApi.isLoading.value || mediaListsApi.isLoading.value
  const isLoadingProfiles = isInitialLoadingProfile.value || externalUserProfileApi.isLoading.value

  return (isLoadingMediaItems || isLoadingMediaList)
    && (!currentMediaItems.value?.length || isLoadingProfiles)
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
      :is-loading="isLoading"
      :is-user-list-owner="isUserListOwner"
      :media-list="currentMediaList"
      :media-list-items="currentMediaItems"
    />
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
