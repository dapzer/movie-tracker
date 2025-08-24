<script setup lang="ts">
import type { MediaItemType, MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import MediaListDetailsContent from "~/widgets/mediaList/ui/MediaListDetailsContent.vue"
import MediaListDetailsHeader from "~/widgets/mediaList/ui/MediaListDetailsHeader.vue"
import MediaListDetailsHeaderSkeleton from "~/widgets/mediaList/ui/MediaListDetailsHeaderSkeleton.vue"

interface MediaListDetailsProps {
  mediaList?: MediaListType
  mediaListItems?: MediaItemType[]
  userProfile?: UserType | UserPublicType
  isUserListOwner?: boolean
  isLoading?: boolean
}

const props = defineProps<MediaListDetailsProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListDetailsHeaderSkeleton v-if="props.isLoading" />
    <MediaListDetailsHeader
      v-else-if="props.mediaList && props.userProfile && props.mediaListItems"
      :media-list="props.mediaList"
      :is-user-list-owner="props.isUserListOwner"
      :media-items="props.mediaListItems"
      :user-profile="props.userProfile"
    />
    <MediaListDetailsContent
      :is-loading="props.isLoading"
      :media-list-items="props.mediaListItems"
      :is-user-list-owner="props.isUserListOwner"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
