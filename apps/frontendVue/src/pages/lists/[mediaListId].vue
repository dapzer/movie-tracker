<script lang="ts" setup>import { useRoute } from "vue-router";
import { useGetMediaListsApi, useGetMediaListsByIdApi } from "~/composables/useMediaListApi";
import { computed, ref } from "vue";
import { useGetMediaItemsApi, useGetMediaItemsByMediaListIdApi } from "~/composables/useMediaItemtApi";
import { useAuth } from "~/composables/useAuth";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { useI18n } from "#imports";
import { MediaItemsStatusedCategory, MediaItemsStatusedCategorySkeleton } from "~/features/mediaItem";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { checkIsAuthError } from "~/utils/checkIsAuthError";
import MediaListFilters from "~/features/mediaList/ui/MediaListFilters.vue";
import { mediaListSortingOptions, type MediaListSortingOptionType } from "~/features/mediaList";

const { mediaListId = "" } = useRoute().params;
const { isNotAuthorized, isLoadingProfile } = useAuth();
const { isLoading: isLoadingMediaLists, data: mediaLists } = useGetMediaListsApi();
const { data: mediaItems } = useGetMediaItemsApi();
const { t } = useI18n();

const isUserListOwner = computed(() => {
  return mediaLists?.value?.some(list => list.id === mediaListId);
});

const isUseExternalData = computed(() => {
  return (!isUserListOwner.value && !isLoadingMediaLists.value) || (isNotAuthorized.value && !isLoadingMediaLists.value);
});

const {
  isLoading: isLoadingExternalMediaList,
  data: externalMediaList,
  error: errorExternalMediaList
} = useGetMediaListsByIdApi(mediaListId as string, {
  enabled: isUseExternalData,
  retry: false
});
const {
  isLoading: isLoadingExternalMediaItems,
  data: externalMediaItems
} = useGetMediaItemsByMediaListIdApi(mediaListId as
  string, {
  enabled: isUseExternalData,
  retry: false
});

const searchValue = ref("");
const sortModel = ref<MediaListSortingOptionType>(mediaListSortingOptions[0]);

const isNotPublicList = computed(() => {
  return errorExternalMediaList.value && checkIsAuthError(errorExternalMediaList.value);
});

const currentMediaList = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaList?.value;
  }

  return mediaLists?.value?.find(list => list.id === mediaListId);
});

const currentMediaItems = computed(() => {
  if (!isUserListOwner.value) {
    return externalMediaItems?.value;
  }

  return mediaItems?.value?.filter(item => item.mediaListId === mediaListId);
});

const filteredMediaItems = computed(() => {
  const sortedArray = currentMediaItems?.value?.slice().sort((a, b) => {
    const aDate = new Date(a[sortModel.value.field]);
    const bDate = new Date(b[sortModel.value.field]);

    if (sortModel.value.order === "desc") {
      return bDate < aDate ? 1: -1;
    } else {
      return aDate < bDate ? 1 : -1;
    }
  })

  if (!searchValue.value) {
    return sortedArray;
  }

  const searchLowerCase = searchValue.value.toLowerCase();

  const filteredBySearchValue = sortedArray?.filter(item => {
    const mediaDetails = item.mediaDetails;

    const isRuTitle = mediaDetails?.ru.title?.toLowerCase().includes(searchLowerCase);
    const isEnTitle = mediaDetails?.en.title?.toLowerCase().includes(searchLowerCase);
    const isOriginalTitle = mediaDetails?.en.originalTitle?.toLowerCase().includes(searchLowerCase);

    return isRuTitle || isEnTitle || isOriginalTitle;
  });

  return filteredBySearchValue;
});

const title = computed(() => {
  return t(isUseExternalData.value ? "mediaList.userList" : "mediaList.yourList", {
    title: currentMediaList?.value?.title || t("mediaList.favorites")
  });
});

</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography
      v-if="isLoadingProfile"
      variant="title2"
    >
      {{ $t("auth.authInProgress") }}...
    </UiTypography>

    <UiTypography
      v-if="isNotPublicList"
      variant="title2"
    >
      {{ $t("mediaList.private") }}
    </UiTypography>

    <template v-if="!isNotPublicList">
      <UiTypography
        v-if="!isLoadingProfile && !isLoadingMediaLists && !isLoadingExternalMediaList"
        :class="$style.title"
        as="h1"
        variant="title2"
      >
        {{ title }}
      </UiTypography>

      <UiTypography
        v-if="!isLoadingProfile && !isLoadingMediaLists && !isLoadingExternalMediaList && !currentMediaItems?.length"
        variant="title3"
      >
        {{ $t("mediaList.empty") }}
      </UiTypography>

      <MediaItemsStatusedCategorySkeleton
        v-if="(isLoadingExternalMediaList || isLoadingMediaLists) &&
          !isLoadingProfile && !currentMediaItems?.length"
      />

      <template v-else-if="currentMediaItems">
        <MediaListFilters
          v-model:sortModel="sortModel"
          @on-change-search-value="searchValue = $event"
        />
        <template v-if="filteredMediaItems?.length">
          <MediaItemsStatusedCategory
            v-for="status in MediaItemStatusNameEnum"
            :key="status"
            :is-list-owner="isUserListOwner"
            :items="filteredMediaItems"
            :status="status"
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
}
</style>
