<script lang="ts" setup>
import { useI18n, useNavigateToSignInPage, useSeoMeta } from "#imports"
import { computed } from "vue"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import { useAuth } from "~/composables/useAuth"
import { CreateMediaListModal, MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { SortOrderEnum } from "~/types/Sorting"
import { getListDeclensionTranslationKey } from "~/utils/getListDeclensionTranslationKey"
import { getSortedArrayByDate } from "~/utils/getSortedArrayByDate"
import { UiButton } from "../../shared/ui/UiButton"
import { UiContainer } from "../../shared/ui/UiContainer"
import { UiIcon } from "../../shared/ui/UiIcon"
import { UiListHeader } from "../../shared/ui/UiListHeader"

const { isLoadingProfile, isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()
const getMediaListsApi = useGetMediaListsApi()

const { t } = useI18n()

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
        ? `${getMediaListsApi.data.value?.length || 0} ${$t(getListDeclensionTranslationKey(getMediaListsApi.data.value?.length || 0))}` : ''"
      title-as="h1"
      title-variant="title2"
    >
      <template
        v-if="isAuthorized"
        #controls
      >
        <CreateMediaListModal>
          <template #trigger="{ openModal }">
            <UiButton
              with-icon
              @click="openModal"
            >
              <UiIcon name="icon:plus" />
              {{ $t("mediaList.create") }}
            </UiButton>
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

    <div :class="$style.lists">
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
    </div>
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/styles/variables";
@import "~/styles/mixins";

@layer external {
  .wrapper {
    padding-top: 60px !important;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.lists {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 40px;

  @include tabletDevice {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @include mobileDevice {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
