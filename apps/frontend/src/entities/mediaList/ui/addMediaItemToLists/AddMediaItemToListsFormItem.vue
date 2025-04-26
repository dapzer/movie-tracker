<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiDropdown, UiDropdownGroup, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiFormListItem } from "~/shared/ui/UiFormListItem"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"

interface AddMediaItemToListsFormItemProps {
  mediaList: MediaListType
}

const props = defineProps<AddMediaItemToListsFormItemProps>()
const emits = defineEmits<{
  (e: "onStatusChange", status: MediaItemStatusNameEnum): void
}>()
const model = defineModel<boolean>()
const statusModel = defineModel<MediaItemStatusNameEnum>("status")

const { t } = useI18n()

const titlesInListCount = computed(() => {
  return props.mediaList.mediaItemsCount || 0
})

const dropdownItems = computed(() => {
  const rea = []

  for (const status in MediaItemStatusNameEnum) {
    rea.push({
      label: t(`mediaItem.status.${status}`),
      value: status as MediaItemStatusNameEnum,
    })
  }

  return rea
})
</script>

<template>
  <UiFormListItem
    v-model="model"
    :wrapper-class="$style.wrapper"
    :title="props.mediaList.title ?? $t('mediaList.favorites')"
    :description="!model ? `${titlesInListCount} ${$t(getElementDeclensionTranslationKey(titlesInListCount))}` : ''"
  >
    <template #rightContent>
      <template v-if="!model">
        <UiIcon
          v-if="props.mediaList.isPublic"
          block
          name="icon:shared-planet"
          :size="20"
        />
        <UiIcon
          v-else
          block
          name="icon:locker"
          :size="20"
        />
      </template>

      <template v-else>
        <UiDropdown
          align="end"
          :indent="20"
          :trigger-class="$style.dropdownTrigger"
          :content-class="$style.dropdownContent"
        >
          <template #trigger>
            {{ t(`mediaItem.status.${statusModel}`) }}
            <UiIcon
              name="icon:double-arrow"
              :size="16"
            />
          </template>

          <template #content>
            <UiDropdownGroup :class="$style.dropdownGroup">
              <UiDropdownItem
                v-for="item in dropdownItems"
                :key="item.value"
                @click="emits('onStatusChange', item.value)"
              >
                <template #iconStart>
                  <UiIcon
                    v-if="item.value === statusModel"
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
    </template>
  </UiFormListItem>
</template>

<style module lang="scss">
.wrapper {
  height: 40px;
}

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

.dropdownContent {
  padding: 4px;
}

.dropdownGroup {
  gap: 0;
}

.dropdownIcon {
  color: var(--c-label-secondary);
}
</style>
