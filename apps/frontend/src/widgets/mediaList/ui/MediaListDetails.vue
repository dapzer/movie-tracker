<script setup lang="ts">

import type { MediaListType, UserPublicType, UserType } from "@movie-tracker/types"
import MediaListDetailsHeader from "~/widgets/mediaList/ui/MediaListDetailsHeader.vue"
import MediaListDetailsHeaderSkeleton from "~/widgets/mediaList/ui/MediaListDetailsHeaderSkeleton.vue"

interface MediaListDetailsProps {
  mediaList?: MediaListType;
  userProfile?: UserType | UserPublicType
  isUserListOwner?: boolean;
  isLoading?: boolean;
}

const props = defineProps<MediaListDetailsProps>();
</script>

<template>
  <div>
    <MediaListDetailsHeaderSkeleton v-if="props.isLoading" />
    <MediaListDetailsHeader
      v-else-if="props.mediaList && props.userProfile"
      :media-list="props.mediaList"
      :is-user-list-owner="props.isUserListOwner"
      :user-profile="props.userProfile"
    />
    <!--    <MediaListDetailsContent :mediaList="props.mediaList" :isUserListOwner="props.isUserListOwner" />-->
  </div>
</template>

<style scoped lang="scss">

</style>
