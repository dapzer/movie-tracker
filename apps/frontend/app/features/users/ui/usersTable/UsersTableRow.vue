<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { formatDateWithTime } from "~/shared/utils/formatDateWithTime"

interface UsersTableRowProps {
  user: UserPublicType
}

const props = defineProps<UsersTableRowProps>()

const localePath = useLocalePath()
const { locale } = useI18n()
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <UiUserProfileLink
        :user-id="props.user.id"
        :user-name="props.user.name"
        :user-avatar-src="props.user.image"
        :user-page-url="localePath(`/profile/${props.user.id}`)"
      />
    </UiTableCell>
    <UiTableCell>
      <UiTypography variant="description">
        {{ props.user.id }}
      </UiTypography>
    </UiTableCell>
    <UiTableCell>
      {{ formatDateWithTime(props.user.createdAt, locale) }}
    </UiTableCell>
  </UiTableRow>
</template>
