<script setup lang="ts">
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiUserProfileLinkSkeleton } from "~/shared/ui/UiUserProfileLink"

interface MediaListCardSkeletonProps {
  horizontal?: boolean
}

const props = defineProps<MediaListCardSkeletonProps>()
</script>

<template>
  <UiListCard
    :horizontal="props.horizontal"
    :width="560"
  >
    <template #header>
      <UiUserProfileLinkSkeleton :class="$style.user" />
    </template>
    <template #content>
      <div :class="$style.content">
        <UiSkeleton :width="70" />
        <UiSkeleton :width="90" />
      </div>
    </template>
    <template #footer>
      <UiSkeleton :width="30" />
    </template>
  </UiListCard>
</template>

<style module lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  width: 100%;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
