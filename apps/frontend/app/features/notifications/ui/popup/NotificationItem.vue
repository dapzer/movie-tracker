<script setup lang="ts">
import type { NotificationMetaResponseType, NotificationType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { NotificationTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
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
      return props.notification.meta as Extract<NotificationMetaResponseType, { type: NotificationTypeEnum.MEDIA_LIST_LIKE }>
    case NotificationTypeEnum.USER_FOLLOW:
      return props.notification.meta as Extract<NotificationMetaResponseType, { type: NotificationTypeEnum.USER_FOLLOW }>
    default:
      return undefined
  }
})

const notificationMessage = computed(() => {
  switch (props.notification.type) {
    case NotificationTypeEnum.MEDIA_LIST_LIKE: {
      const typedMeta = metaData?.value as Extract<NotificationMetaResponseType, { type: NotificationTypeEnum.MEDIA_LIST_LIKE }>
      return t("notifications.mediaListLike", {
        userName: metaData.value?.actorUser.name,
        listTitle: getShortText(typedMeta.mediaList.title, 12) || t("mediaList.favorites"),
      })
    }
    case NotificationTypeEnum.USER_FOLLOW: {
      const typedMeta = metaData?.value as Extract<NotificationMetaResponseType, { type: NotificationTypeEnum.USER_FOLLOW }>
      return t("notifications.userFollow", {
        userName: typedMeta.actorUser.name,
      })
    }
    default:
      return ""
  }
})

const linkTo = computed(() => {
  switch (props.notification.type) {
    case NotificationTypeEnum.MEDIA_LIST_LIKE:
      return `/profile/${metaData.value?.actorUser.id}`
    case NotificationTypeEnum.USER_FOLLOW:
      return `/profile/${metaData.value?.actorUser.id}`
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
</style>
