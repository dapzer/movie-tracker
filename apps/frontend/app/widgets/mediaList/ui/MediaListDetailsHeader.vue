<script setup lang="ts">
import type { MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useClipboard } from "@vueuse/core"
import { toast } from "vue3-toastify"
import { useCreateLikeMediaListApi, useDeleteLikeMediaListApi } from "~/api/mediaLists/useMediaListsApi"
import { CloneMediaListModal, EditMediaListModal, MediaListsLimitTooltip } from "~/entities/mediaList"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { getDeclensionTranslationKey } from "~/shared/utils/getDeclensionTranslationKey"

interface MediaListHeaderProps {
  mediaList: MediaListType
  userProfile: UserType | UserPublicType
  isUserListOwner: boolean
}

const props = defineProps<MediaListHeaderProps>()
const { t } = useI18n()
const localePath = useLocalePath()
const { copy, copied } = useClipboard({ copiedDuring: 1000 })

const { navigateToSignInPage } = useNavigateToSignInPage()
const { isAuthorized } = useAuth()

const createLikeMediaListApi = useCreateLikeMediaListApi()
const deleteLikeMediaListApi = useDeleteLikeMediaListApi()

async function copyLink() {
  await copy(`${window.location.origin}/lists/details/${props.mediaList.humanFriendlyId}`).then(() => {
    toast.success(t("toasts.linkSuccessfullyCopied"))
  }).catch(() => {
    toast.error(t("toasts.linkUnsuccessfullyCopied"))
  })
}

async function handleLike() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  if (props.mediaList.isLiked) {
    await deleteLikeMediaListApi.mutateAsync(props.mediaList.id).then(() => {
      toast.success(t("toasts.mediaList.successDisliked"))
    }).catch(() => {
      toast.error(t("toasts.mediaList.unsuccessfullyDisliked"))
    })
  }
  else {
    await createLikeMediaListApi.mutateAsync(props.mediaList.id).then(() => {
      toast.success(t("toasts.mediaList.successLiked"))
    }).catch(() => {
      toast.error(t("toasts.mediaList.unsuccessfullyLiked"))
    })
  }
}
</script>

<template>
  <div :class="$style.wrapper">
    <div>
      <div :class="$style.subTitle">
        <UiTypography
          :class="$style.titleType"
          variant="labelSmall"
        >
          <UiIcon
            name="icon:list-logo"
            :size="16"
          />
          {{ $t("mediaList.listTitle").toUpperCase() }}
        </UiTypography>
        <UiDivider
          vertical
          :height="16"
          :width="1"
        />
        <UiUserProfileLink
          :avatar-size="20"
          :user-id="props.userProfile.id"
          :user-name="props.userProfile.name"
          :user-avatar-src="props.userProfile.image"
          :user-page-url="localePath(`/profile/${props.userProfile.id}`)"
        />
      </div>

      <UiTypography
        variant="title2"
        as="h1"
      >
        {{ props.mediaList.title || t("mediaList.favorites") }}
      </UiTypography>
    </div>
    <UiTypography
      v-if="props.mediaList.description"
      :class="$style.description"
    >
      {{ props.mediaList.description }}
    </UiTypography>

    <div :class="$style.actions">
      <UiButton
        with-icon
        :class="{ [$style.active]: props.mediaList.isLiked, [$style.inactive]: props.isUserListOwner }"
        variant="text"
        :disabled="createLikeMediaListApi.isPending.value || deleteLikeMediaListApi.isPending.value"
        @click="handleLike"
      >
        <UiIcon
          name="icon:like"
          :size="16"
        />
        {{ props.mediaList.likesCount }}
        {{ $t(`ui.like.${getDeclensionTranslationKey(props.mediaList.likesCount || 0)}`).toLowerCase() }}
      </UiButton>
      <UiButton
        with-icon
        variant="text"
        :disabled="copied"
        @click="copyLink"
      >
        <UiIcon
          name="icon:share"
          :size="16"
        />
        {{ $t("ui.share") }}
      </UiButton>
      <CloneMediaListModal :media-list="props.mediaList">
        <template #trigger="{ openModal }">
          <MediaListsLimitTooltip>
            <template #default="{ isLimitReached }">
              <UiButton
                with-icon
                variant="text"
                :disabled="isLimitReached"
                @click="() => isAuthorized ? openModal() : navigateToSignInPage()"
              >
                <UiIcon name="icon:create-clone" />
                {{ t("mediaList.createClone.submit") }}
              </UiButton>
            </template>
          </MediaListsLimitTooltip>
        </template>
      </CloneMediaListModal>

      <EditMediaListModal
        v-if="props.isUserListOwner"
        :media-list="props.mediaList"
      >
        <template #trigger="{ openModal }">
          <UiButton
            with-icon
            variant="text"
            @click="openModal"
          >
            <UiIcon name="icon:edit" />
            {{ t("ui.edit") }}
          </UiButton>
        </template>
      </EditMediaListModal>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.subTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  min-width: 0px;
}

.titleType {
  display: flex;
  align-items: center;
  gap: 6px;
}

.description {
  white-space: pre-wrap;
}

.profile {
  margin-top: 8px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;

  @include mobileDevice() {
    align-items: flex-start;
    //flex-direction: column;
    flex-wrap: wrap;
  }

  & > button {
    color: var(--c-white-75);

    &:focus,
    &:active,
    &:hover {
      color: var(--c-white-90);
    }

    &.active {
      color: var(--c-label-link);

      &:focus,
      &:active,
      &:hover {
        color: var(--c-label-link-hovered);
      }
    }

    &.inactive {
      cursor: unset;

      &:focus,
      &:active,
      &:hover {
        color: var(--c-white-75);
      }
    }
  }
}
</style>
