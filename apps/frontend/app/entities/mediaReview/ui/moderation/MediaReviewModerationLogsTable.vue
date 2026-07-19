<script setup lang="ts">
import type { MediaReviewModerationLog } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaReviewModerationLogAction, MediaReviewModerationLogReason } from "@movie-tracker/types"
import MediaReviewModerationLogSnapshotModal
  from "~/entities/mediaReview/ui/moderation/MediaReviewModerationLogSnapshotModal.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTable, UiTableBody, UiTableCell, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { formatDateWithTime } from "~/shared/utils/formatDateWithTime"

interface MediaReviewModerationLogsTableProps {
  logs?: MediaReviewModerationLog[]
  loading?: boolean
  loadingItemsCount?: number
}

const props = withDefaults(defineProps<MediaReviewModerationLogsTableProps>(), {
  logs: () => [],
  loading: false,
  loadingItemsCount: 5,
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

function getActionTranslationKey(action: MediaReviewModerationLogAction) {
  switch (action) {
    case MediaReviewModerationLogAction.APPROVED:
      return "mediaReview.moderation.publish"
    case MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK:
      return "mediaReview.moderation.publishWithSpoiler"
    case MediaReviewModerationLogAction.CHANGES_REQUESTED:
      return "mediaReview.moderation.status.changesRequested"
    default:
      return "mediaReview.moderation.status.removed"
  }
}

function getReasonText(log: MediaReviewModerationLog) {
  if (!log.reason)
    return "-"

  switch (log.reason) {
    case MediaReviewModerationLogReason.OFF_TOPIC:
      return t("mediaReview.moderation.reason.offTopic")
    case MediaReviewModerationLogReason.SPAM:
      return t("mediaReview.moderation.reason.spam")
    case MediaReviewModerationLogReason.TOXICITY:
      return t("mediaReview.moderation.reason.toxicity")
    case MediaReviewModerationLogReason.LOW_EFFORT_JUNK:
      return t("mediaReview.moderation.reason.lowEffortJunk")
    default:
      return t("mediaReview.moderation.reason.other")
  }
}
</script>

<template>
  <UiTable>
    <UiTableHeader>
      <UiTableRow>
        <UiTableHead :width="190">
          {{ $t("mediaReview.moderation.logsModal.table.action") }}
        </UiTableHead>
        <UiTableHead :width="170">
          {{ $t("mediaReview.moderation.logsModal.table.reason") }}
        </UiTableHead>
        <UiTableHead :width="250">
          {{ $t("mediaReview.moderation.logsModal.table.comment") }}
        </UiTableHead>
        <UiTableHead :width="130">
          {{ $t("mediaReview.moderation.logsModal.table.snapshot") }}
        </UiTableHead>
        <UiTableHead :width="264">
          {{ $t("mediaReview.moderation.logsModal.table.moderator") }}
        </UiTableHead>
        <UiTableHead :width="140">
          {{ $t("mediaReview.moderation.logsModal.table.date") }}
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>

    <UiTableBody>
      <template v-if="!props.loading">
        <UiTableRow
          v-for="log in props.logs"
          :key="log.id"
        >
          <UiTableCell>
            {{ $t(getActionTranslationKey(log.action)) }}
          </UiTableCell>
          <UiTableCell>
            {{ getReasonText(log) }}
          </UiTableCell>
          <UiTableCell>
            <div :class="$style.comment">
              {{ log.comment || "-" }}
            </div>
          </UiTableCell>
          <UiTableCell>
            <MediaReviewModerationLogSnapshotModal :log="log">
              <template #trigger="{ openModal }">
                <UiButton
                  variant="text"
                  scheme="link"
                  @click="openModal"
                >
                  {{ $t("mediaReview.moderation.logsModal.snapshotModal.open") }}
                </UiButton>
              </template>
            </MediaReviewModerationLogSnapshotModal>
          </UiTableCell>
          <UiTableCell>
            <UiUserProfileLink
              v-if="log.moderator"
              :user-id="log.moderator.id"
              :user-name="log.moderator.name"
              :user-avatar-src="log.moderator.image"
              :user-page-url="localePath(`/profile/${log.moderator.id}`)"
            />
            <template v-else>
              -
            </template>
          </UiTableCell>
          <UiTableCell>
            {{ formatDateWithTime(log.createdAt, locale) }}
          </UiTableCell>
        </UiTableRow>
      </template>

      <template v-else>
        <UiTableRow
          v-for="i of props.loadingItemsCount"
          :key="i"
        >
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
        </UiTableRow>
      </template>
    </UiTableBody>
  </UiTable>
</template>

<style module lang="scss">
.comment {
  white-space: normal;
  min-width: 180px;
}
</style>
