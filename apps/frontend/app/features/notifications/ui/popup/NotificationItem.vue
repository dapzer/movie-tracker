<script setup lang="ts">
import type { BanReason, ExtractNotificationMetaResponseType, NotificationType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import {
  MediaReviewModerationLogAction,
  MediaReviewModerationLogReason,
  MediaTypeEnum,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { computed } from "vue"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDateWithTime } from "~/shared/utils/formatDateWithTime"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import { getShortText } from "~/shared/utils/getShortText"
import { getTimeSinceDate } from "~/shared/utils/getTimeSinceDate"

interface NotificationItem {
  notification: NotificationType
}

const props = defineProps<NotificationItem>()

const { locale, t } = useI18n()
const localePath = useLocalePath()

const reviewModerationTranslationKeys = {
  [MediaReviewModerationLogAction.APPROVED]: "notifications.reviewModerationApproved",
  [MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK]: "notifications.reviewModerationApprovedWithSpoiler",
  [MediaReviewModerationLogAction.CHANGES_REQUESTED]: "notifications.reviewModerationChangesRequested",
  [MediaReviewModerationLogAction.REJECTED]: "notifications.reviewModerationRejected",
} satisfies Record<MediaReviewModerationLogAction, string>

const reviewModerationReasonTranslationKeys = {
  [MediaReviewModerationLogReason.OFF_TOPIC]: "mediaReview.moderation.reason.offTopic",
  [MediaReviewModerationLogReason.SPAM]: "mediaReview.moderation.reason.spam",
  [MediaReviewModerationLogReason.TOXICITY]: "mediaReview.moderation.reason.toxicity",
  [MediaReviewModerationLogReason.LOW_EFFORT_JUNK]: "mediaReview.moderation.reason.lowEffortJunk",
  [MediaReviewModerationLogReason.OTHER]: "mediaReview.moderation.reason.other",
} satisfies Record<MediaReviewModerationLogReason, string>

const banReasonTranslationKeys = {
  SPAM: "users.ban.reason.spam",
  TOXICITY: "users.ban.reason.toxicity",
  MSFW: "users.ban.reason.msfw",
  FRAUD: "users.ban.reason.fraud",
  OTHER: "users.ban.reason.other",
} satisfies Record<BanReason, string>

const metaData = computed(() => {
  switch (props.notification.type) {
    case NotificationTypeEnum.MEDIA_LIST_LIKE:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_LIST_LIKE>
    case NotificationTypeEnum.USER_FOLLOW:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.USER_FOLLOW>
    case NotificationTypeEnum.MEDIA_RELEASE:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_RELEASE>
    case NotificationTypeEnum.MEDIA_STATUS_UPDATE:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_STATUS_UPDATE>
    case NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE>
    case NotificationTypeEnum.USER_BAN_CREATED:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.USER_BAN_CREATED>
    case NotificationTypeEnum.USER_BAN_REVOKED:
      return props.notification.meta as ExtractNotificationMetaResponseType<NotificationTypeEnum.USER_BAN_REVOKED>
    default:
      return undefined
  }
})

const notificationMessage = computed(() => {
  switch (metaData.value?.type) {
    case NotificationTypeEnum.MEDIA_LIST_LIKE: {
      return t("notifications.mediaListLike", {
        userName: metaData.value?.actorUser.name,
        listTitle: getShortText(metaData.value.mediaList.title, 12) || t("mediaList.favorites"),
      })
    }
    case NotificationTypeEnum.USER_FOLLOW: {
      return t("notifications.userFollow", {
        userName: metaData.value.actorUser.name,
      })
    }
    case NotificationTypeEnum.MEDIA_RELEASE: {
      const details = getCurrentMediaDetails(metaData.value.mediaDetails, locale.value)
      if (!details) {
        return ""
      }

      if (metaData.value.mediaDetails.mediaType === MediaTypeEnum.TV && metaData.value.episodes) {
        const multipleEpisodes = metaData.value.episodes && metaData.value.episodes.length > 1
        const firstEpisode = metaData.value.episodes[0]!
        const episodeString = multipleEpisodes
          ? `${firstEpisode.episodeNumber} - ${metaData.value.episodes.at(-1)!.episodeNumber}`
          : `${firstEpisode.episodeNumber}`
        const isSpecial = firstEpisode.seasonNumber === 0
        const specialSeasonTranslationKey = multipleEpisodes ? "notifications.episodeReleasedInSpecialSeason" : "notifications.episodesReleasedInSpecialSeason"
        const usualSeasonTranslationKey = multipleEpisodes ? "notifications.episodesReleased" : "notifications.episodeReleased"

        return t(isSpecial ? specialSeasonTranslationKey : usualSeasonTranslationKey, {
          episode: episodeString,
          season: isSpecial
            ? details.seasons![0]!.name
            : firstEpisode.seasonNumber,
          title: getShortText(details.title || details.originalTitle!, 16),
        })
      }

      return t("notifications.movieReleased", {
        title: getShortText(details.title || details.originalTitle!, 16),
      })
    }
    case NotificationTypeEnum.MEDIA_STATUS_UPDATE: {
      const details = getCurrentMediaDetails(metaData.value.mediaDetails, locale.value)
      if (!details) {
        return ""
      }

      return t("notifications.statusUpdated", {
        title: getShortText(details.title || details.originalTitle!, 16),
        oldStatus: t(`details.seriesStatusName.${metaData.value?.previousStatus.toLowerCase()}`),
        newStatus: t(`details.seriesStatusName.${metaData.value?.currentStatus.toLowerCase()}`),
      })
    }
    case NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE: {
      const details = getCurrentMediaDetails(metaData.value.mediaDetails, locale.value)
      if (!details) {
        return ""
      }

      const message = t(reviewModerationTranslationKeys[metaData.value.action], {
        title: getShortText(details.title || details.originalTitle!, 16),
      })

      if (
        metaData.value.reason
        && (metaData.value.action === MediaReviewModerationLogAction.CHANGES_REQUESTED || metaData.value.action === MediaReviewModerationLogAction.REJECTED)
      ) {
        return t("notifications.reviewModerationWithReason", {
          message,
          reason: t(reviewModerationReasonTranslationKeys[metaData.value.reason]),
        })
      }

      return message
    }
    case NotificationTypeEnum.USER_BAN_CREATED: {
      const reason = t(banReasonTranslationKeys[metaData.value.reason])

      if (metaData.value.expiresAt) {
        return t("notifications.userBanCreatedUntil", {
          reason,
          expiresAt: formatDateWithTime(metaData.value.expiresAt, locale.value),
        })
      }

      return t("notifications.userBanCreated", { reason })
    }
    case NotificationTypeEnum.USER_BAN_REVOKED:
      return t("notifications.userBanRevoked")

    default:
      return ""
  }
})

const linkTo = computed(() => {
  switch (metaData.value?.type) {
    case NotificationTypeEnum.MEDIA_LIST_LIKE:
      return `/profile/${metaData.value?.actorUser.id}`
    case NotificationTypeEnum.USER_FOLLOW:
      return `/profile/${metaData.value?.actorUser.id}`
    case NotificationTypeEnum.MEDIA_RELEASE:
      if (metaData.value?.mediaDetails.mediaType === MediaTypeEnum.TV) {
        return `/details/${metaData.value?.mediaDetails.mediaType}/${metaData.value?.mediaDetails.mediaId}/seasons`
      }
      return `/details/${metaData.value?.mediaDetails.mediaType}/${metaData.value?.mediaDetails.mediaId}`
    case NotificationTypeEnum.MEDIA_STATUS_UPDATE:
      return `/details/${metaData.value?.mediaDetails.mediaType}/${metaData.value?.mediaDetails.mediaId}`
    case NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE:
      return `/reviews/${metaData.value.mediaReviewId}`
    case NotificationTypeEnum.USER_BAN_CREATED:
    case NotificationTypeEnum.USER_BAN_REVOKED:
      return undefined
    default:
      return "/notifications"
  }
})
</script>

<template>
  <component
    :is="linkTo ? NuxtLink : 'div'"
    :class="$style.wrapper"
    :to="linkTo ? localePath(linkTo) : undefined"
  >
    <div :class="$style.leftSection">
      <span
        :class="[$style.readStatus, {
          [$style.unread]: !props.notification.readAt,
        }]"
      />
      <template
        v-if="metaData?.type === NotificationTypeEnum.MEDIA_LIST_LIKE || metaData?.type === NotificationTypeEnum.USER_FOLLOW"
      >
        <div :class="$style.avatarWithBadgeWrapper">
          <UiAvatar
            :size="36"
            :placeholder-id="metaData?.actorUser.id"
            :alt="`${metaData?.actorUser.name} avatar`"
            :src="metaData.actorUser.image"
          />
          <UiBadge
            :class="$style.badge"
            size="small"
          >
            <UiIcon
              v-if="props.notification.type === NotificationTypeEnum.USER_FOLLOW"
              name="icon:like"
              :size="10"
            />
            <UiIcon
              v-else
              name="icon:thumb-up"
              :class="$style.thumbUpIcon"
              :width="10"
              :height="12"
            />
          </UiBadge>
        </div>
      </template>
      <template v-else-if="metaData?.type === NotificationTypeEnum.MEDIA_RELEASE || metaData?.type === NotificationTypeEnum.MEDIA_STATUS_UPDATE || metaData?.type === NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE">
        <UiImage
          :class="$style.poster"
          width="42"
          height="64"
          :alt="`${metaData?.mediaDetails.en.originalTitle} poster`"
          :src="getProxiedImageUrl(getCurrentMediaDetails(metaData.mediaDetails, locale)?.poster, 100)"
        />
      </template>
      <template v-else-if="metaData?.type === NotificationTypeEnum.USER_BAN_CREATED || metaData?.type === NotificationTypeEnum.USER_BAN_REVOKED">
        <UiIcon
          name="icon:logo"
          :size="36"
        />
      </template>
    </div>
    <div>
      <UiTypography
        variant="description"
        :class="$style.title"
      >
        {{ notificationMessage }}
      </UiTypography>
      <UiTypography variant="description">
        {{ getTimeSinceDate(props.notification.createdAt, locale) }}
      </UiTypography>
    </div>
  </component>
</template>

<style module lang="scss">
.wrapper {
  padding: 12px 20px 12px 4px;
  display: flex;
  gap: 12px;
}

.title {
  color: var(--c-text);
  font-weight: var(--fw-medium);
  margin-bottom: 2px;
}

.leftSection {
  display: flex;
  align-items: center;
  gap: 4px;
  height: fit-content;
}

.readStatus {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: transparent;
  margin: 4px;
  align-self: center;
}

.unread {
  background-color: var(--c-unread-notification-mark);
}

.avatarWithBadgeWrapper {
  position: relative;

  .badge {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0;
  }
}

.thumbUpIcon {
  color: #fff;
}

.poster {
  border-radius: var(--s-border-radius-small);
  width: 42px;
  height: 64px;
  object-fit: cover;
}
</style>
