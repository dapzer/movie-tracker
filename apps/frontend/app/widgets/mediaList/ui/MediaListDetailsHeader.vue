<script setup lang="ts">
import type { MediaItemType, MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useClipboard } from "@vueuse/core"
import { useCreateLikeMediaListApi, useDeleteLikeMediaListApi } from "~/api/mediaList/useMediaListApi"
import { CloneMediaListModal, EditMediaListModal, MediaListsLimitTooltip } from "~/entities/mediaList"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"

interface MediaListHeaderProps {
  mediaList: MediaListType
  mediaItems: MediaItemType[]
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

function copyLink() {
  copy(`${window.location.origin}/lists/details/${props.mediaList.humanFriendlyId}`)
}

async function handleLike() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  if (props.mediaList.isLiked) {
    await deleteLikeMediaListApi.mutateAsync(props.mediaList.id)
  }
  else {
    await createLikeMediaListApi.mutateAsync(props.mediaList.id)
  }
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <div :class="$style.about">
        <UiTypography
          as="h1"
          variant="title2"
          :class="$style.title"
        >
          {{ $t("mediaList.listTitle") }} ‘<span>{{ props.mediaList.title || t("mediaList.favorites") }}</span>’
        </UiTypography>

        <div
          v-if="!props.isUserListOwner"
          :class="$style.publicInfo"
        >
          <UiUserProfileLink
            :user-id="props.userProfile.id"
            :user-name="props.userProfile.name"
            :user-avatar-src="props.userProfile.image"
            :user-page-url="localePath(`/profile/${props.userProfile.id}`)"
          />
          <UiTypography
            :class="$style.likes"
            variant="description"
          >
            <UiIcon
              name="icon:like"
              :size="16"
            />
            {{ props.mediaList.likesCount }}
          </UiTypography>
          <UiButton
            :class="$style.shareButton"
            variant="text"
            :disabled="copied"
            @click="copyLink"
          >
            <UiIcon
              name="icon:share"
              :size="20"
            />
          </UiButton>
        </div>

        <UiTypography
          v-if="props.mediaList.description"
          :class="$style.description"
        >
          {{ props.mediaList.description }}
        </UiTypography>
      </div>

      <div :class="$style.actions">
        <CloneMediaListModal
          :media-list="props.mediaList"
          :media-items="props.mediaItems"
        >
          <template #trigger="{ openModal }">
            <MediaListsLimitTooltip>
              <template #default="{ isLimitReached }">
                <UiButton
                  with-icon
                  scheme="secondary"
                  :disabled="isLimitReached"
                  @click="() => isAuthorized ? openModal() : navigateToSignInPage()"
                >
                  <UiIcon name="icon:clone" />
                  {{ t("mediaList.createClone.title") }}
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
              @click="openModal"
            >
              <UiIcon name="icon:edit" />
              {{ t("ui.edit") }}
            </UiButton>
          </template>
        </EditMediaListModal>

        <UiButton
          v-else
          with-icon
          :disabled="createLikeMediaListApi.isPending.value || deleteLikeMediaListApi.isPending.value"
          :variant="props.mediaList.isLiked ? 'outlined' : 'boxed'"
          :scheme="props.mediaList.isLiked ? 'secondary' : 'primary'"
          @click="handleLike"
        >
          <UiIcon name="icon:like" />
          {{ t("ui.like.single") }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  min-width: 0;

  .info {
    min-width: 0;

    display: flex;
    justify-content: space-between;
    gap: 16px;

    @include tabletDevice {
      flex-wrap: wrap;
      max-width: unset;
    }

    .about {
      width: 100%;
      max-width: 690px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      @include tabletDevice {
        max-width: unset;
      }
      min-width: 0;

      .title {
        display: flex;
        min-width: 0;
        width: 100%;
        white-space: nowrap;

        span {
          @include ellipsisText;
        }
      }

      .publicInfo {
        display: flex;
        gap: 28px;
        align-items: center;
        width: 100%;

        .likes {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .shareButton {
          height: fit-content;
          color: var(--c-description);
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            color: var(--c-label-lihk-hovered);
          }
        }
      }

      .description {
        color: var(--c-description);
      }
    }

    .actions {
      height: fit-content;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 10px;

      button {
        height: fit-content;
        min-height: 36px;

        @include tabletDevice {
          min-height: 40px;
        }
      }

      @include mobileDevice {
        flex-wrap: nowrap;
        height: unset;

        &,
        button {
          width: 100%;
        }

        button {
          height: 100%;
          min-height: unset;
        }
      }
    }
  }
}
</style>
