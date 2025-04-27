<script setup lang="ts">
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiDropdown, UiDropdownGroup, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"

interface AddMediaItemToListsStatusSelectorProps {
  currentStatus: MediaItemStatusNameEnum
}

const props = defineProps<AddMediaItemToListsStatusSelectorProps>()
const emits = defineEmits<{
  (e: "onStatusChange", status: MediaItemStatusNameEnum): void
}>()
const { t } = useI18n()

const dropdownItems = computed(() => {
  const result = []

  for (const status in MediaItemStatusNameEnum) {
    result.push({
      label: t(`mediaItem.status.${status}`),
      value: status as MediaItemStatusNameEnum,
    })
  }

  return result
})
</script>

<template>
  <UiDropdown
    align="end"
    :indent="20"
    :trigger-class="$style.dropdownTrigger"
    size="small"
  >
    <template #trigger>
      {{ t(`mediaItem.status.${props.currentStatus}`) }}
      <UiIcon
        name="icon:double-arrow"
        :size="16"
      />
    </template>

    <template #content>
      <UiDropdownGroup>
        <UiDropdownItem
          v-for="item in dropdownItems"
          :key="item.value"
          @click="emits('onStatusChange', item.value)"
        >
          <template #iconStart>
            <UiIcon
              v-if="item.value === props.currentStatus"
              name="icon:check"
              :class="$style.dropdownIcon"
            />
          </template>
          <template #content>
            {{ item.label }}
          </template>
        </UiDropdownItem>
      </UiDropdownGroup>
    </template>
  </UiDropdown>
</template>

<style module lang="scss">
.dropdownTrigger {
  padding: 0 6px;
  border-radius: var(--s-border-radius-small);
  color: var(--c-white-75);
  font-size: var(--fs-description);
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  height: 32px;
  margin-right: -8px;

  &[aria-expanded="true"],
  &:hover {
    background-color: var(--c-white-05);
  }
}

.dropdownIcon {
  color: var(--c-label-secondary);
}
</style>
