<script lang="ts" setup>import { useRoute } from "vue-router";
import { useGetMediaListsApi, useGetMediaListsByIdApi } from "~/api/mediaList/useMediaListApi";
import { computed, ref } from "vue";
import { useGetMediaItemsApi, useGetMediaItemsByMediaListIdApi } from "~/api/mediaItem/useMediaItemtApi";
import { useAuth } from "~/composables/useAuth";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { getShortText, useI18n, useSeoMeta } from "#imports";
import { MediaItemsStatusedCategory, MediaItemsStatusedCategorySkeleton } from "~/features/mediaItem";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { checkIsAuthError } from "~/utils/checkIsAuthError";
import MediaListFilters from "~/features/mediaList/ui/MediaListFilters.vue";
import { MediaListCreateCloneModal, useMediaListSettings } from "~/features/mediaList";
import { filterMediaListItems } from "~/features/mediaList/model/filterMediaListItems";
import { SignInModal } from "~/features/signIn";

const { t } = useI18n();
const { mediaListId: mediaListHumanFriendlyId = "" } = useRoute().params;
const { currentMedaListSettings, handleCategoryState } = useMediaListSettings(mediaListHumanFriendlyId as string);
const { isLoadingProfile, isNotAuthorized } = useAuth();

const searchValue = ref("");

const mediaListsApi = useGetMediaListsApi();
const mediaItemsApi = useGetMediaItemsApi();

const isUserListOwner = computed(() => {
  return mediaListsApi.data.value?.some(list => list.humanFriendlyId === mediaListHumanFriendlyId);
});

const isUseExternalData = computed(() => {
  return !isUserListOwner.value && !mediaListsApi.isLoading.value && !isLoadingProfile.value;
});

const externalMediaListApi = useGetMediaListsByIdApi(mediaListHumanFriendlyId as string, {
  enabled: isUseExternalData,
  retry: false
});

const externalMediaItemsApi = useGetMediaItemsByMediaListIdApi(mediaListHumanFriendlyId as
  string, {
  enabled: isUseExternalData,
  retry: false
});

const isNotPublicList = computed(() => {
  return externalMediaListApi.error.value && checkIsAuthError(externalMediaListApi.error.value);
});

const currentMediaList = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaListApi.data.value;
  }

  return mediaListsApi.data.value?.find(list => list.humanFriendlyId === mediaListHumanFriendlyId);
});

const currentMediaItems = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaItemsApi.data.value;
  }

  return mediaItemsApi.data.value?.filter(item => item.mediaListId === currentMediaList.value?.id);
});

const filteredMediaItems = computed(() => {
  if (!currentMediaItems.value) {
    return [];
  }

  return filterMediaListItems(currentMediaItems.value, searchValue.value, currentMedaListSettings.value.sortModel);
});

const isLoading = computed(() => {
  const isLoadingMediaItems = externalMediaItemsApi.isLoading.value || mediaItemsApi.isLoading.value;
  const isLoadingMediaList = externalMediaListApi.isLoading.value || mediaListsApi.isLoading.value;

  return (isLoadingMediaItems || isLoadingMediaList || isLoadingProfile.value) && !currentMediaItems.value?.length;
});

const title = computed(() => {
  return t(isUseExternalData.value ? "mediaList.userList" : "mediaList.yourList", {
    title: currentMediaList?.value?.title || t("mediaList.favorites")
  });
});

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t("mediaList.userList", {
      title: getShortText(currentMediaList?.value?.title, 12) ||
        t("mediaList.favorites")
    })}`;
  },
  ogTitle() {
    return `%s | ${t("mediaList.userList", {
      title: getShortText(currentMediaList?.value?.title, 12) ||
        t("mediaList.favorites")
    })}`;
  }
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MediaItemsStatusedCategorySkeleton
      v-if="isLoading"
    />

    <UiTypography
      v-else-if="isNotPublicList"
      variant="title2"
    >
      {{ $t("mediaList.private") }}
    </UiTypography>

    <template v-else>
      <div :class="$style.header">
        <UiTypography
          :class="$style.title"
          as="h1"
          variant="title2"
        >
          {{ title }}
        </UiTypography>

        <SignInModal
          v-if="isNotAuthorized"
          :btn-title="$t('mediaList.createClone.title')"
          button-size="small"
        />
        <MediaListCreateCloneModal
          v-else-if="currentMediaItems?.length"
          :media-list="currentMediaList"
          :media-items="currentMediaItems"
        />
      </div>

      <UiTypography
        v-if="!currentMediaItems?.length"
        variant="title3"
      >
        {{ $t("mediaList.empty") }}
      </UiTypography>

      <template v-if="currentMediaItems?.length">
        <MediaListFilters
          v-model:sortModel="currentMedaListSettings.sortModel"
          @on-change-search-value="searchValue = $event"
        />

        <template v-if="filteredMediaItems.length">
          <MediaItemsStatusedCategory
            v-for="status in MediaItemStatusNameEnum"
            :key="status"
            :is-list-owner="isUserListOwner"
            :is-opened-default="currentMedaListSettings.categoriesState[status]"
            :items="filteredMediaItems"
            :status="status"
            @handle-category-state="handleCategoryState"
          />
        </template>

        <UiTypography
          v-else
        >
          {{ $t("search.notingFound") }}
        </UiTypography>
      </template>
    </template>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .title {
    word-break: break-all;
  }

  .header {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    button {
      height: fit-content;
    }
  }
}
</style>
