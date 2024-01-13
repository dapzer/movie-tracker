<script lang="ts" setup>import { useRoute } from "vue-router";
import { useGetMediaListsApi, useGetMediaListsByIdApi } from "~/composables/useMediaListApi";
import { computed } from "vue";
import { useGetMediaItemsApi, useGetMediaItemsByMediaListIdApi } from "~/composables/useMediaItemtApi";
import { useAuth } from "~/composables/useAuth";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { useI18n, watch } from "#imports";
import { MediaItemsStatusedCategory, MediaItemsStatusedCategorySkeleton } from "~/features/mediaItem";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { checkIsAuthError } from "~/utils/checkIsAuthError";

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
  data: externalMediaItems,
} = useGetMediaItemsByMediaListIdApi(mediaListId as
  string, {
  enabled: isUseExternalData,
  retry: false
});

const isNotPublicList = computed(() => {
  return errorExternalMediaList.value && checkIsAuthError(errorExternalMediaList.value);
});

const currentMediaList = computed(() => {
  return isUserListOwner.value ? mediaLists?.value?.find(list => list.id === mediaListId) : externalMediaList?.value;
});
const currentMediaItems = computed(() => {
  return isUserListOwner.value ? mediaItems?.value?.filter(item => item.mediaListId === mediaListId) :
    externalMediaItems?.value;
});

const title = computed(() => {
  return t(isUseExternalData.value ? "mediaList.userList" : "mediaList.yourList", {
    title: currentMediaList?.value?.title
      || (currentMediaList?.value?.isSystem ? t("mediaList.favorites") : t("mediaList.nameNotSet"))
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
        <MediaItemsStatusedCategory
          v-for="status in MediaItemStatusNameEnum"
          :key="status"
          :items="currentMediaItems"
          :status="status"
        />
      </template>
    </template>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
