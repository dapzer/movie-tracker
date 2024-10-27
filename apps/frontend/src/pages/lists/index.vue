<script lang="ts" setup>

import { UiTypography } from "~/components/newUi/UiTypography";
import { UiContainer } from "~/components/newUi/UiContainer";
import { useAuth } from "~/composables/useAuth";
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi";
import { useI18n, useNavigateToSignInPage, useSeoMeta } from "#imports";
import { UiListHeader } from "~/components/newUi/UiListHeader"
import { CreateMediaListModal, MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { UiButton } from "~/components/newUi/UiButton"
import { PlusIcon } from "~/components/ui/icons"
import { getListDeclensionTranslationKey } from "~/utils/getListDeclensionTranslationKey"

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
          <template #trigger>
            <UiButton with-icon>
              <PlusIcon />
              {{ $t("mediaList.create") }}
            </UiButton>
          </template>
        </CreateMediaListModal>
      </template>
    </UiListHeader>


    <div
      v-if="!isLoadingProfile && !isAuthorized"
      :class="$style.unauthorized"
    >
      <UiTypography variant="title4">
        {{ $t("auth.notAuthorized") }}
      </UiTypography>
      <UiTypography>
        {{ $t("mediaList.notAuthorized") }}
      </UiTypography>
      <UiButton
        variant="text"
        scheme="link"
        @click="navigateToSignInPage"
      >
        {{ $t("auth.signIn") }}
      </UiButton>
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
        v-for="i in 6"
        v-else
        :key="i"
      />
    </div>
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/styles/newVariables";
@import "~/styles/mixins";

@layer external {
  .wrapper {
    padding-top: 60px !important;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.unauthorized {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  max-width: 454px;
  margin: 70px auto 0;

  p {
    text-align: center;
    color: var(--c-description);
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
