<script setup lang="ts">
import type { VNode } from "vue"
import type { MediaListDetailsSortOption } from "~/widgets/mediaList/ui/MediaListDetailsContent.vue"
import { useI18n } from "#imports"
import { computed, h, ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiPopover } from "~/shared/ui/UiPopover"

interface Option {
  label: string
  value: MediaListDetailsSortOption
  icon: VNode
}

const { t } = useI18n()

const open = ref(false)

const sortTypeModel = defineModel<MediaListDetailsSortOption>()
const sortArrowUpIcon = h(UiIcon, { name: "icon:arrow-up-with-list", size: 20 })

const sortArrowDownIcon = h(UiIcon, { name: "icon:arrow-down-with-list", size: 20 })
const options = computed<Array<Option>>(() => {
  return [
    {
      label: t("mediaList.sort.createdAt"),
      value: "asc_createdAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("mediaList.sort.createdAt"),
      value: "desc_createdAt",
      icon: sortArrowDownIcon,
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: "asc_updatedAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: "desc_updatedAt",
      icon: sortArrowDownIcon,
    },
  ]
})

const selectedOption = computed(() => {
  return options.value.find(option => option.value === sortTypeModel.value)
})

function handleOptionSelect(option: Option) {
  sortTypeModel.value = option.value
  open.value = false
}
</script>

<template>
  <UiPopover
    v-model="open"
    as-child
    align="end"
    :width="265"
    :content-spacing="0"
    :indent="10"
  >
    <template #trigger>
      <UiButton
        :class="$style.body"
        variant="boxed"
        scheme="medium-gray"
        with-icon
      >
        <component :is="selectedOption?.icon" />
        {{ selectedOption?.label }}
      </UiButton>
    </template>
    <template #content>
      <div :class="$style.options">
        <template
          v-for="(option, index) in options"
          :key="option.value"
        >
          <UiButton
            variant="text"
            :class="$style.option"
            with-icon
            @click="handleOptionSelect(option)"
          >
            <component :is="option.icon" />
            {{ option.label }}
          </UiButton>
          <UiDivider
            v-if="index < options.length - 1"
          />
        </template>
      </div>
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.body {
  border-radius: var(--s-border-radius-super-mega-huge);
  font-size: var(--fs-label-small);
  width: max-content;
}
.options {
}
.option {
  padding: 8px 10px;
  gap: 8px;
  width: 100%;
  font-size: var(--fs-label-small);
  justify-content: flex-start;

  &:focus,
  &:active,
  &:hover {
    background: var(--c-white-05);
  }
}
</style>
