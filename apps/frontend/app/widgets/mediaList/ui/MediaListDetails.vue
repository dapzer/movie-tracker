<script setup lang="ts">
import type { MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import MediaListDetailsContent from "~/widgets/mediaList/ui/MediaListDetailsContent.vue"
import MediaListDetailsHeader from "~/widgets/mediaList/ui/MediaListDetailsHeader.vue"

interface MediaListDetailsProps {
  mediaList?: MediaListType
  userProfile?: UserType | UserPublicType
  isUserListOwner?: boolean
}

const props = defineProps<MediaListDetailsProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListDetailsHeader
      v-if="props.mediaList && props.userProfile"
      :media-list="props.mediaList"
      :is-user-list-owner="props.isUserListOwner"
      :user-profile="props.userProfile"
    />
    <MediaListDetailsContent
      v-if="props.mediaList"
      :media-list="props.mediaList"
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
