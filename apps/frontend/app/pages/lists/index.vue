<script lang="ts" setup>
import { onBeforeMount, useI18n, useSeoMeta } from "#imports"
import { MEDIA_LIST_COUNT_LIMIT, SortOrderEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import {
  CreateMediaListModal,
  MediaListCard,
  MediaListCardSkeleton,
  MediaListsLimitTooltip,
} from "~/entities/mediaList"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiListsGrid } from "~/shared/ui/UiListsGrid"
import { getListDeclensionTranslationKey } from "~/shared/utils/getListDeclensionTranslationKey"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"
import { UiButton } from "../../shared/ui/UiButton"
import { UiContainer } from "../../shared/ui/UiContainer"
import { UiIcon } from "../../shared/ui/UiIcon"
import { UiListHeader } from "../../shared/ui/UiListHeader"

const { isLoadingProfile, isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()
const getMediaListsApi = useGetMediaListsApi()

const { t } = useI18n()

onBeforeMount(() => {
  getMediaListsApi.refetch()
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("mediaList.yourLists")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("mediaList.yourLists")}`
  },
})

const sortedMediaLists = computed(() => {
  return getSortedArrayByDate(getMediaListsApi.data.value || [], SortOrderEnum.DESC, "createdAt")
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiListHeader
      :title="$t('mediaList.yourLists')"
      :subtitle="isAuthorized
        ? `${getMediaListsApi.data.value?.length || 0}/${MEDIA_LIST_COUNT_LIMIT}
        ${$t(getListDeclensionTranslationKey(getMediaListsApi.data.value?.length || 0))}` : ''"
      title-as="h1"
      title-variant="title2"
    >
      <template
        v-if="isAuthorized"
        #controls
      >
        <CreateMediaListModal>
          <template #trigger="{ openModal }">
            <MediaListsLimitTooltip>
              <template #default="{ isLimitReached }">
                <UiButton
                  with-icon
                  :disabled="isLimitReached"
                  @click="openModal"
                >
                  <UiIcon name="icon:plus" />
                  {{ $t("mediaList.create") }}
                </UiButton>
              </template>
            </MediaListsLimitTooltip>
          </template>
        </CreateMediaListModal>
      </template>
    </UiListHeader>

    <UiAttention
      v-if="!isLoadingProfile && !isAuthorized"
      :title="$t('auth.notAuthorized')"
      :description="$t('mediaList.notAuthorized')"
    >
      <UiButton
        variant="text"
        scheme="link"
        @click="navigateToSignInPage"
      >
        {{ $t("auth.signIn") }}
      </UiButton>
    </UiAttention>

    <UiListsGrid>
      <template v-if="getMediaListsApi.data.value && !getMediaListsApi.isLoading.value">
        <MediaListCard
          v-for="list in sortedMediaLists"
          :key="list.id"
          :list="list"
        />
      </template>
      <MediaListCardSkeleton
        v-for="i in 6"
        v-else-if="getMediaListsApi.isLoading.value"
        :key="i"
      />
    </UiListsGrid>
  </UiContainer>
</template>

<style lang="scss" module>
@layer external {
  .wrapper {
    padding-top: 60px !important;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
