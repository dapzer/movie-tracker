<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { UiModal } from "~/shared/ui/UiModal"
import BanUserForm from "./BanUserForm.vue"

interface BanUserModalProps {
  user: UserPublicType
}

const props = defineProps<BanUserModalProps>()
const slots = defineSlots()
const modalVisible = defineModel<boolean>()
</script>

<template>
  <UiModal
    v-model="modalVisible"
    :max-width="495"
    :title="$t('users.ban.modal.title')"
  >
    <template
      v-if="slots.trigger"
      #trigger="{ openModal }"
    >
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>

    <template #content>
      <BanUserForm
        :user="props.user"
        @on-cancel="modalVisible = false"
        @on-success="modalVisible = false"
      />
    </template>
  </UiModal>
</template>
