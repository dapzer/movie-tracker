<script setup lang="ts">
import { computed } from "vue"
import { useGetMediaReviewModerationLogsApi } from "~/api/mediaReviewModeration/useMediaReviewModerationApi"
import MediaReviewModerationLogsTable from "~/entities/mediaReview/ui/moderation/MediaReviewModerationLogsTable.vue"
import { UiAttention } from "~/shared/ui/UiAttention"

interface MediaReviewModerationLogsModalContentProps {
  mediaReviewId: string
}

const props = defineProps<MediaReviewModerationLogsModalContentProps>()

const getMediaReviewModerationLogsApiArgs = computed(() => {
  return {
    mediaReviewId: props.mediaReviewId,
  }
})

const getMediaReviewModerationLogsApi = useGetMediaReviewModerationLogsApi(getMediaReviewModerationLogsApiArgs)

const logs = computed(() => getMediaReviewModerationLogsApi.data.value || [])
</script>

<template>
  <MediaReviewModerationLogsTable
    v-if="getMediaReviewModerationLogsApi.isPending.value || logs.length"
    :logs="logs"
    :loading="getMediaReviewModerationLogsApi.isPending.value"
    :loading-items-count="5"
  />

  <UiAttention
    v-else
    :title="$t('mediaReviews.moderation.logsModal.empty')"
    :indent="0"
    title-variant="subheading"
  />
</template>

<style scoped lang="scss">

</style>
