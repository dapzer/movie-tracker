<script lang="ts" setup>

import { UiContainer } from "~/components/ui/UiContainer";
import { useAuth } from "~/composables/useAuth";
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi";
import { useI18n, useNavigateToSignInPage, useSeoMeta } from "#imports";
import { UiListHeader } from "~/components/ui/UiListHeader"
import { CreateMediaListModal, MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { UiButton } from "~/components/ui/UiButton"
import { getListDeclensionTranslationKey } from "~/utils/getListDeclensionTranslationKey"
import UiAttention from "~/components/ui/UiAttention/UiAttention.vue"
import { computed } from "vue"
import { UiIcon } from "~/components/ui/UiIcon"

const { isLoadingProfile, isAuthorized } = useAuth();
const { navigateToSignInPage } = useNavigateToSignInPage()
const getMediaListsApi = useGetMediaListsApi();

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("mediaList.yourLists")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("mediaList.yourLists")}`;
  }
});

const sortedMediaLists = computed(() => {
  return [...getMediaListsApi.data.value || []].sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    return bDate < aDate ? 1 : -1;
  }) || []
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiListHeader
      :title="$t('mediaList.yourLists')"
      :subtitle="isAuthorized ?
        `${getMediaListsApi.data.value?.length || 0} ${$t(getListDeclensionTranslationKey(getMediaListsApi.data.value?.length || 0))}` : ''"
      title-as="h1"
      title-variant="title2"
    >
      <template
        v-if="isAuthorized"
        #controls
      >
        <CreateMediaListModal>
          <template #trigger="{openModal}">
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
