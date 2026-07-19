<script setup lang="ts">
import type { UserBan } from "@movie-tracker/types"
import { nextTick, useI18n } from "#imports"
import { ref } from "vue"
import { toast } from "vue3-toastify"
import { useRevokeUserBanApi } from "~/api/userBans/useUserBansApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiConfirmationModal } from "~/shared/ui/UiConfirmationModal"
import { UiDropdown, UiDropdownGroup, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UserBansTableRowActionsProps {
  userBan: UserBan
}

const props = defineProps<UserBansTableRowActionsProps>()

const { t } = useI18n()
const revokeUserBanApi = useRevokeUserBanApi()
const isDropdownOpen = ref(false)
const isConfirmationOpen = ref(false)

async function openRevokeConfirmation() {
  isDropdownOpen.value = false
  await nextTick()
  isConfirmationOpen.value = true
}

async function revokeBan() {
  await revokeUserBanApi.mutateAsync({ id: props.userBan.id }).then(() => {
    toast.success(t("toasts.userBan.successRevoked"))
  }).catch(() => {
    toast.error(t("toasts.userBan.unsuccessfullyRevoked"))
  })
}
</script>

<template>
  <UiDropdown
    v-model="isDropdownOpen"
    align="end"
    :indent="8"
    size="small"
  >
    <template #trigger>
      <UiButton
        as="span"
        variant="icon"
        size="small"
        :aria-label="$t('userBans.table.actions')"
      >
        <UiIcon name="icon:ellipsis-vertical" />
      </UiButton>
    </template>

    <template #content>
      <UiDropdownGroup>
        <UiDropdownItem
          :disabled="props.userBan.revokedAt"
          @click="openRevokeConfirmation"
        >
          <template #content>
            {{ $t('userBans.actions.revoke') }}
          </template>
        </UiDropdownItem>
      </UiDropdownGroup>
    </template>
  </UiDropdown>

  <UiConfirmationModal
    v-model="isConfirmationOpen"
    :title="$t('userBans.revoke.confirm.title')"
    :description="$t('userBans.revoke.confirm.description', { userName: props.userBan.userProfile?.name })"
    :confirm-text="$t('ui.yes')"
    :cancel-text="$t('ui.no')"
    scheme="danger"
    @confirm="revokeBan"
  />
</template>
