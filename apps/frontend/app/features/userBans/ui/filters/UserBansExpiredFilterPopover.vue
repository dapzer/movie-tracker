<script setup lang="ts">
import { useI18n } from "#imports"
import { computed, ref, watch } from "vue"
import { UiCheckboxList } from "~/shared/ui/UiCheckboxList"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"

type UserBanStatusFilter = "active" | "expired"

const statuses = defineModel<UserBanStatusFilter[]>({ default: () => [] })
const openModel = ref(false)
const draftStatuses = ref<UserBanStatusFilter[]>([...statuses.value])

const { t } = useI18n()

const statusOptions = computed(() => [
  {
    label: t("userBans.filters.status.active"),
    value: "active",
  },
  {
    label: t("userBans.filters.status.expired"),
    value: "expired",
  },
])

const isActive = computed(() => statuses.value.length > 0)

function clearStatus() {
  draftStatuses.value = []
  statuses.value = []
}

watch(openModel, (isOpen) => {
  if (isOpen) {
    draftStatuses.value = [...statuses.value]
    return
  }

  statuses.value = [...draftStatuses.value]
})
</script>

<template>
  <UiPopover
    v-model="openModel"
    as-child
    :width="265"
    :content-spacing="0"
    :indent="10"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="clearStatus"
      >
        {{ t("userBans.filters.status.title") }}
      </UiFilterTrigger>
    </template>

    <template #content>
      <UiCheckboxList
        v-model="draftStatuses"
        :options="statusOptions"
      />
    </template>
  </UiPopover>
</template>
