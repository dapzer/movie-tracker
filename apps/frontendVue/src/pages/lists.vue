<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { useAuth } from "~/composables/useAuth";
import { SignInModal } from "~/features/signIn";
import { useGetMediaListsApi } from "~/composables/useMediaListApi";
import { MediaListCard } from "~/features/mediaList";

const { isLoadingProfile, isAuthorized } = useAuth();
const { isLoading: isLoadingMediaLists, data: mediaLists } = useGetMediaListsApi();
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

    <template v-if="mediaLists && !isLoadingMediaLists && isAuthorized">
      <UiTypography variant="title2">
        {{ $t("mediaList.yourLists") }}
      </UiTypography>

      <div :class="$style.lists">
        <MediaListCard
          v-for="list in mediaLists"
          :key="list.id"
          :list="list"
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

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
