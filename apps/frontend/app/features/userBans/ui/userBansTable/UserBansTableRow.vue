<script setup lang="ts">
import type { BanReason, UserBan, UserPublicType } from "@movie-tracker/types"
import type { UiBadgeColor } from "~/shared/ui/UiBadge"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import UserBansTableRowActions from "~/features/userBans/ui/userBansTable/UserBansTableRowActions.vue"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { formatDateWithTime } from "~/shared/utils/formatDateWithTime"

interface UserBansTableRowProps {
  userBan: UserBan
}

const props = defineProps<UserBansTableRowProps>()

const { t, locale } = useI18n()
const localePath = useLocalePath()

const status = computed(() => {
  if (props.userBan.revokedAt) {
    return "revoked"
  }

  if (props.userBan.expiresAt && new Date(props.userBan.expiresAt).getTime() <= Date.now()) {
    return "expired"
  }

  return "active"
})

function getReasonText(reason: BanReason) {
  switch (reason) {
    case "SPAM":
      return t("users.ban.reason.spam")
    case "TOXICITY":
      return t("users.ban.reason.toxicity")
    case "MSFW":
      return t("users.ban.reason.msfw")
    case "FRAUD":
      return t("users.ban.reason.fraud")
    default:
      return t("users.ban.reason.other")
  }
}

const statusTagColor = computed<UiBadgeColor>(() => {
  switch (status.value) {
    case "active":
      return "primary"
    case "expired":
      return "gray"
    case "revoked":
      return "orange"
    default:
      return "gray"
  }
})

function getUserProfileUrl(user?: UserPublicType) {
  return user ? localePath(`/profile/${user.id}`) : undefined
}
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <UiUserProfileLink
        v-if="props.userBan.userProfile"
        :user-id="props.userBan.userProfile.id"
        :user-name="props.userBan.userProfile.name"
        :user-avatar-src="props.userBan.userProfile.image"
        :user-page-url="getUserProfileUrl(props.userBan.userProfile)"
      />
      <UiTypography
        v-else
        variant="description"
      >
        {{ props.userBan.userId }}
      </UiTypography>
    </UiTableCell>
    <UiTableCell>
      <UiBadge
        size="small"
        :color="statusTagColor"
      >
        {{ $t(`userBans.status.${status}`) }}
      </UiBadge>
    </UiTableCell>
    <UiTableCell>
      {{ getReasonText(props.userBan.reason) }}
    </UiTableCell>
    <UiTableCell>
      <div :class="$style.comment">
        {{ props.userBan.comment || "-" }}
      </div>
    </UiTableCell>
    <UiTableCell>
      <UiUserProfileLink
        v-if="props.userBan.issuerUserProfile"
        :user-id="props.userBan.issuerUserProfile.id"
        :user-name="props.userBan.issuerUserProfile.name"
        :user-avatar-src="props.userBan.issuerUserProfile.image"
        :user-page-url="getUserProfileUrl(props.userBan.issuerUserProfile)"
      />
      <template v-else>
        -
      </template>
    </UiTableCell>
    <UiTableCell>
      {{ props.userBan.expiresAt ? formatDateWithTime(props.userBan.expiresAt, locale) : $t("userBans.table.permanent") }}
    </UiTableCell>
    <UiTableCell>
      {{ formatDateWithTime(props.userBan.createdAt, locale) }}
    </UiTableCell>
    <UiTableCell align="right">
      <UserBansTableRowActions :user-ban="props.userBan" />
    </UiTableCell>
  </UiTableRow>
</template>

<style module lang="scss">
.comment {
  min-width: 180px;
  white-space: normal;
}
</style>
