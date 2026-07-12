<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { nextTick } from "#imports"
import { ref } from "vue"
import BanUserModal from "~/features/users/ui/banUser/BanUserModal.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDropdown, UiDropdownGroup, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UsersTableRowActionsProps {
  user: UserPublicType
}

const props = defineProps<UsersTableRowActionsProps>()

const isBanUserModalOpen = ref(false)
const isDropdownOpen = ref(false)

async function onBanUserModalOpen() {
  isDropdownOpen.value = false
  // We need to wait for the next tick to ensure that the dropdown is closed before opening the modal
  await nextTick()
  isBanUserModalOpen.value = true
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
        variant="icon"
        size="small"
        :aria-label="$t('users.table.actions')"
      >
        <UiIcon name="icon:settings" />
      </UiButton>
    </template>

    <template #content>
      <UiDropdownGroup>
        <UiDropdownItem @click="onBanUserModalOpen">
          <template #content>
            {{ $t('users.actions.ban') }}
          </template>
        </UiDropdownItem>
      </UiDropdownGroup>
    </template>
  </UiDropdown>

  <BanUserModal
    v-model="isBanUserModalOpen"
    :user="props.user"
  />
</template>
