<script setup lang="ts">

import { UiTextarea } from "~/components/newUi/UiTextarea"
import type { MediaItemType } from "@movie-tracker/types"

interface MediaItemTrackingMenuProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemTrackingMenuProps>();
</script>

<template>
  <UiTextarea :placeholder="$t('mediaItem.trackingMenu.tabs.note')" />
</template>

<style scoped lang="scss">

</style>
