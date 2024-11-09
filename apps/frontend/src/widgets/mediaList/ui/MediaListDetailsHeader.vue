<script setup lang="ts">
import type { MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import { computed } from "vue"
import { useI18n } from "#imports"
import { UiTypography } from "~/components/newUi/UiTypography"
import { CloneIcon, EditIcon, LikeIcon, ShareIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import { UiUserProfileLink } from "~/components/newUi/UiUserProfileLink"
import { useClipboard } from "@vueuse/core"
import { EditMediaListModal } from "~/entities/mediaList"

interface MediaListHeaderProps {
  mediaList: MediaListType;
  userProfile: UserType | UserPublicType
  isUserListOwner: boolean;
}

const props = defineProps<MediaListHeaderProps>();
const { t } = useI18n();
const { copy, copied } = useClipboard({ copiedDuring: 1000 });

const title = computed(() => {
  return t("mediaList.listPageTitle", {
    title: props.mediaList.title || t("mediaList.favorites")
  });
});

const copyLink = () => {
  copy(`${window.location.origin}/lists/details/${props.mediaList.humanFriendlyId}`);
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
        <UiButton
          with-icon
          scheme="secondary"
        >
          <CloneIcon />
          {{ t("mediaList.createClone.title") }}
        </UiButton>
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
          :scheme="props.mediaList.isLiked ? 'tertiary' : 'primary'"
        >
          <LikeIcon />
          {{ t("ui.like") }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
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
