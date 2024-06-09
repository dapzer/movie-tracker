<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { useAuth } from "~/composables/useAuth";
import { SignInModal } from "~/features/auth";
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi";
import { MediaListCard, MediaListCardSkeleton, MediaListCreateModal } from "~/features/mediaList";
import { useI18n, useSeoMeta } from "#imports";

const { isLoadingProfile, isAuthorized } = useAuth();
const getMediaListsApi = useGetMediaListsApi();

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t("mediaList.yourLists")}`;
  },
  ogTitle() {
    return `%s | ${t("mediaList.yourLists")}`;
  }
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography
      v-if="!isLoadingProfile && !isAuthorized"
      :class="$style.unauthorized"
      variant="title2"
    >
      <SignInModal
        :btn-title="$t('mediaList.unauthorizedTitle')"
        button-variant="clear"
      />
      {{ $t("mediaList.unauthorizedDescription") }}
    </UiTypography>

    <UiTypography
      v-if="isLoadingProfile"
      variant="title2"
    >
      {{ $t("auth.authInProgress") }}...
    </UiTypography>

    <template v-if="isAuthorized">
      <div :class="$style.listsTitle">
        <UiTypography variant="title2">
          {{ $t("mediaList.yourLists") }}
        </UiTypography>
        <MediaListCreateModal />
      </div>

      <div :class="$style.lists">
        <template v-if="getMediaListsApi.data.value && !getMediaListsApi.isLoading.value">
          <MediaListCard
            v-for="list in getMediaListsApi.data.value"
            :key="list.id"
            :list="list"
          />
        </template>
        <MediaListCardSkeleton
          v-for="i in 8"
          v-else
          :key="i"
        />
      </div>
    </template>
  </UiContainer>
</template>

<style lang="scss" module>
.unauthorized {
  button {
    font-size: inherit;
    font-weight: inherit;
    border-bottom: 1px solid var(--c-secondary);
  }
}

.lists {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.listsTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
