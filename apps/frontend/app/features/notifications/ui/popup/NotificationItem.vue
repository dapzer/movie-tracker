<script setup lang="ts">
import type { ExtractNotificationMetaResponseType, NotificationType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaTypeEnum, NotificationTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
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
        const episodeString = multipleEpisodes
          ? `${metaData.value.episodes[0]!.episodeNumber} - ${metaData.value.episodes.at(-1)!.episodeNumber}`
          : `${metaData.value.episodes[0]!.episodeNumber}`

        return t(metaData.value.episodes!.length > 1
          ? "notifications.episodesReleased"
          : "notifications.episodeReleased", {
          episode: episodeString,
          season: metaData.value.episodes[0]!.seasonNumber + 1,
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
    default:
      return "/notifications"
  }
})
</script>

<template>
  <NuxtLink
    :class="$style.wrapper"
    :to="localePath(linkTo)"
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
              :width="10"
              :height="12"
            />
          </UiBadge>
        </div>
      </template>
      <template v-else-if="metaData?.type === NotificationTypeEnum.MEDIA_RELEASE || metaData?.type === NotificationTypeEnum.MEDIA_STATUS_UPDATE">
        <UiImage
          :class="$style.poster"
          width="42"
          height="64"
          :placeholder-id="metaData?.mediaDetails.id"
          :alt="`${metaData?.mediaDetails.en.originalTitle} poster`"
          :src="getProxiedImageUrl(getCurrentMediaDetails(metaData.mediaDetails, locale)?.poster, 100)"
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
  </NuxtLink>
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

.avatarWithBadgeWrapper {
}

.poster {
  border-radius: var(--s-border-radius-small);
  width: 42px;
  height: 64px;
  object-fit: cover;
}
</style>
