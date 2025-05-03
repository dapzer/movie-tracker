<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { useGetUserProfileByIdApi } from "~/api/user/useUserApi"
import { MediaRatingSelectModal } from "~/entities/mediaRating"
import { useAuth } from "~/shared/composables/useAuth"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiRating } from "~/shared/ui/UiRating"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaCardRatingProps {
  mediaItem: MediaItemType
  canEditRating?: boolean
}

const props = defineProps<MediaCardRatingProps>()

const { profile, getUserProfileApi, isInitialLoadingProfile } = useAuth()
const { locale } = useI18n()
const isOpenModal = ref(false)

const mediaRating = computed(() => {
  return props.mediaItem.mediaRating
})

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})

const getUserProfileByIdApi = useGetUserProfileByIdApi(
  mediaRating?.value?.userId || "",
  {
    enabled: !!mediaRating?.value?.userId && mediaRating?.value.userId !== profile.value?.id && !isInitialLoadingProfile.value,
  },
)

const getUserApi = computed(() => {
  if (!mediaRating?.value || isInitialLoadingProfile.value) {
    return null
  }
  if (mediaRating?.value.userId === profile.value?.id) {
    return getUserProfileApi
  }
  return getUserProfileByIdApi
})

const user = computed(() => {
  if (!getUserApi.value?.data.value) {
    return null
  }
  return getUserApi.value.data.value
})

function handleRatingClick() {
  if (props.canEditRating) {
    isOpenModal.value = true
  }
}
</script>

<template>
  <div v-bind="$attrs">
    <UiRating
      v-if="mediaRating"
      :class="[$style.rating, {
        [$style.editable]: props.canEditRating,
      }]"
      :value="mediaRating?.rating"
      @click="handleRatingClick"
    >
      <template
        v-if="user"
        #beforeContent
      >
        <UiAvatar
          :size="16"
          :src="user?.image"
          :placeholder-id="user?.id"
          :alt="`${user?.name} avatar`"
        />
        <!--        <div :class="$style.avatarOverlay"> -->
        <!--          <UiAvatar -->
        <!--            :size="16" -->
        <!--            :src="user?.image" -->
        <!--            :placeholder-id="user?.id" -->
        <!--            :alt="`${user?.name} avatar`" -->
        <!--          /> -->
        <!--          <UiIcon -->
        <!--            :class="$style.pencilIcon" -->
        <!--            block -->
        <!--            name="icon:pencil" -->
        <!--            :size="10" -->
        <!--          /> -->
        <!--        </div> -->
      </template>
    </UiRating>
    <UiButton
      v-else
      :class="$style.action"
      scheme="gold"
      @click="isOpenModal = true"
    >
      <UiIcon name="icon:rating-star" />
    </UiButton>
  </div>
  <MediaRatingSelectModal
    v-model="isOpenModal"
    :current-rating="mediaRating"
    :title="details?.title || details?.originalTitle || ''"
    :media-id="mediaItem.mediaId"
    :media-type="mediaItem.mediaType"
  />
</template>

<style module lang="scss">
.rating {
  gap: 6px;

  &.editable {
    cursor: pointer;
  }

  //.avatarOverlay {
  //  .pencilIcon {
  //    display: none;
  //  }
  //}
  //
  //&:hover {
  //  cursor: pointer;
  //  .avatarOverlay {
  //    position: relative;
  //    width: 16px;
  //    height: 16px;
  //    border-radius: 100%;
  //    overflow: hidden;
  //    display: flex;
  //    align-items: center;
  //    justify-content: center;
  //
  //    .pencilIcon {
  //      z-index: 1;
  //      position: absolute;
  //      top: 50%;
  //      left: 50%;
  //      transform: translate(-50%, -50%);
  //      display: block;
  //    }
  //
  //    &:after {
  //      z-index: 0;
  //      content: "";
  //      position: absolute;
  //      top: 0;
  //      left: 0;
  //      width: 100%;
  //      height: 100%;
  //      background-color: var(--c-black-30);
  //    }
  //  }
  //}
}

.action {
  display: var(--action-display);
  background: var(--c-gold-25);
  color: var(--c-gold);
  border-radius: var(--s-border-radius-small);
  width: 20px;
  height: 20px;

  &:hover {
    background: var(--c-gold-30);
  }
}
</style>
