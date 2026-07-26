<script setup lang="ts">
import type { ManagedUserType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useClipboard } from "@vueuse/core"
import UsersTableRowActions from "~/features/users/ui/usersTable/UsersTableRowActions.vue"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiSpoilerText } from "~/shared/ui/UiSpoilerText"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { formatDateWithTime } from "~/shared/utils/formatDateWithTime"

interface UsersTableRowProps {
  user: ManagedUserType
}

const props = defineProps<UsersTableRowProps>()

const localePath = useLocalePath()
const { locale } = useI18n()
const { copy, copied } = useClipboard({ copiedDuring: 1000 })
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <div :class="$style.userProfile">
        <UiUserProfileLink
          :user-id="props.user.id"
          :user-name="props.user.name"
          :user-avatar-src="props.user.image"
          :user-page-url="localePath(`/profile/${props.user.id}`)"
        />
        <UiButton
          variant="textIcon"
          :disabled="copied"
          @click="copy(props.user.id)"
        >
          <UiIcon name="icon:copy" />
        </UiButton>
      </div>
    </UiTableCell>
    <UiTableCell>
      <UiSpoilerText :disabled="!props.user.email">
        {{ props.user.email || "-" }}
      </UiSpoilerText>
    </UiTableCell>
    <UiTableCell>
      <div :class="$style.badges">
        <UiBadge
          v-for="role in props.user.roles"
          :key="role"
          size="small"
          :color="role === 'ADMIN' ? 'primary' : 'gray'"
        >
          {{ role }}
        </UiBadge>
      </div>
    </UiTableCell>
    <UiTableCell>
      <UiSpoilerText>
        {{ props.user.signUpMethod }}
      </UiSpoilerText>
    </UiTableCell>
    <UiTableCell>
      <UiBadge
        size="small"
        :color="props.user.isBanned ? 'tertiary' : 'gray'"
      >
        {{ props.user.isBanned ? $t("users.status.banned") : $t("users.status.active") }}
      </UiBadge>
    </UiTableCell>
    <UiTableCell>
      {{ formatDateWithTime(props.user.createdAt, locale) }}
    </UiTableCell>
    <UiTableCell>
      {{ formatDateWithTime(props.user.updatedAt, locale) }}
    </UiTableCell>
    <UiTableCell align="right">
      <UsersTableRowActions :user="props.user" />
    </UiTableCell>
  </UiTableRow>
</template>

<style module lang="scss">
.badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.userProfile {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
