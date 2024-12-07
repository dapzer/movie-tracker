<script setup lang="ts">
import type { MediaItemType, MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import { computed } from "vue"
import { useAuth, useI18n, useNavigateToSignInPage } from "#imports"
import { UiTypography } from "~/components/ui/UiTypography"
import { CloneIcon, EditIcon, LikeIcon, ShareIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/ui/UiButton"
import { UiUserProfileLink } from "~/components/ui/UiUserProfileLink"
import { useClipboard } from "@vueuse/core"
import { CloneMediaListModal, EditMediaListModal } from "~/entities/mediaList"
import { useCreateLikeMediaListApi, useDeleteLikeMediaListApi } from "~/api/mediaList/useMediaListApi"

interface MediaListHeaderProps {
  mediaList: MediaListType;
  mediaItems: MediaItemType[]
  userProfile: UserType | UserPublicType
  isUserListOwner: boolean;
}

const props = defineProps<MediaListHeaderProps>();
const { t } = useI18n();
const { copy, copied } = useClipboard({ copiedDuring: 1000 });
const { navigateToSignInPage } = useNavigateToSignInPage()
const { isAuthorized } = useAuth()
const createLikeMediaListApi = useCreateLikeMediaListApi()
const deleteLikeMediaListApi = useDeleteLikeMediaListApi()

const title = computed(() => {
  return t("mediaList.listPageTitle", {
    title: props.mediaList.title || t("mediaList.favorites")
  });
});

const copyLink = () => {
  copy(`${window.location.origin}/lists/details/${props.mediaList.humanFriendlyId}`);
};

const handleLike = async () => {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  if (props.mediaList.isLiked) {
    await deleteLikeMediaListApi.mutateAsync(props.mediaList.id)
  } else {
    await createLikeMediaListApi.mutateAsync(props.mediaList.id)
  }
};
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <div :class="$style.about">
        <UiTypography
          as="h1"
          variant="title2"
        >
          {{ title }}
        </UiTypography>

        <div
          v-if="!props.isUserListOwner"
          :class="$style.publicInfo"
        >
          <UiUserProfileLink
            :user-id="props.userProfile.id"
            :user-name="props.userProfile.name"
            :user-avatar-src="props.userProfile.image"
          />
          <UiTypography
            :class="$style.likes"
            variant="description"
          >
            <LikeIcon />
            {{ props.mediaList.likesCount }}
          </UiTypography>
          <UiButton
            :class="$style.shareButton"
            variant="text"
            :disabled="copied"
            @click="copyLink"
          >
            <ShareIcon />
          </UiButton>
        </div>
      </div>

      <div :class="$style.actions">
        <CloneMediaListModal
          :media-list="props.mediaList"
          :media-items="props.mediaItems"
        >
          <template #trigger="{openModal}">
            <UiButton
              with-icon
              scheme="secondary"
              @click="() => isAuthorized ? openModal() : navigateToSignInPage()"
            >
              <CloneIcon />
              {{ t("mediaList.createClone.title") }}
            </UiButton>
          </template>
        </CloneMediaListModal>
        <EditMediaListModal
          v-if="props.isUserListOwner"
          :media-list="props.mediaList"
        >
          <template #trigger="{openModal}">
            <UiButton
              with-icon
              @click="openModal"
            >
              <EditIcon />
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
          <LikeIcon />
          {{ t("ui.like") }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  .info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;

    .about {
      display: flex;
      flex-direction: column;
      gap: 16px;

      h1 {
        @include ellipsisText;
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
    }

    .actions {
      display: flex;
      gap: 8px;

      button {
        height: fit-content;
        min-height: 36px;

        @include tabletDevice {
          min-height: 40px;
        }
      }

      @include mobileDevice {
        &,
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>
