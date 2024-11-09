<script lang="ts" setup>import { useRoute } from "vue-router";
import { useGetMediaListsApi, useGetMediaListsByIdApi } from "~/api/mediaList/useMediaListApi";
import { computed, type Ref, watch } from "vue";
import { useGetMediaItemsApi, useGetMediaItemsByMediaListIdApi } from "~/api/mediaItem/useMediaItemtApi";
import { useAuth } from "~/composables/useAuth";
import UiContainer from "~/components/ui/UiContainer.vue";
import { getShortText, useI18n, useSeoMeta } from "#imports";
import { checkIsAuthError } from "~/utils/checkIsAuthError";
import { useMediaListSettings } from "~/features/mediaList";
import { MediaListDetails } from "~/widgets/mediaList"
import { useUserProfileByIdApi } from "~/api/user/useUserApi"
import UiAttention from "~/components/newUi/UiAttention/UiAttention.vue"
import { UiTypography } from "~/components/newUi/UiTypography"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"

const { t } = useI18n();
const { mediaListId: mediaListHumanFriendlyId = "" } = useRoute().params;
const localePath = useLocalePath()
const { currentMedaListSettings, handleCategoryState } = useMediaListSettings(mediaListHumanFriendlyId as string);
const { isLoadingProfile, isNotAuthorized, profile } = useAuth();

const mediaListsApi = useGetMediaListsApi();
const mediaItemsApi = useGetMediaItemsApi();

const isUserListOwner = computed(() => {
  return !!mediaListsApi.data.value?.some(list => list.humanFriendlyId === mediaListHumanFriendlyId);
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

const externalUserId = computed(() => {
  return externalMediaListApi.data.value?.userId;
});

const externalUserProfileApi = useUserProfileByIdApi(externalUserId as Ref<string>, {
  enabled: !!externalUserId.value,
  retry: false
});

watch(() => externalUserId.value, (userId) => {
  if (userId) {
    externalUserProfileApi.refetch();
  }
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

const currentUserProfile = computed(() => {
  return isUserListOwner.value ? profile.value : externalUserProfileApi.data.value;
});

const isLoading = computed(() => {
  const isLoadingMediaItems = externalMediaItemsApi.isLoading.value || mediaItemsApi.isLoading.value;
  const isLoadingMediaList = externalMediaListApi.isLoading.value || mediaListsApi.isLoading.value;

  return (isLoadingMediaItems || isLoadingMediaList || isLoadingProfile.value) && !currentMediaItems.value?.length;
});

const title = computed(() => {
  return t("mediaList.listPageTitle", {
    title: getShortText(currentMediaList?.value?.title, 12) ||
        t("mediaList.favorites")
  });
});

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${title.value} | ${titleChunk} `;
  },
  ogTitle() {
    return `%s | ${title.value}`;
  }
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiAttention
      v-if="isNotPublicList"
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
      :isLoading="isLoading"
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
