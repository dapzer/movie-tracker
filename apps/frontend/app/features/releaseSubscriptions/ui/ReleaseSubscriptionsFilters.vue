<script setup lang="ts">
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed, h } from "vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiDropdown, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSelect } from "~/shared/ui/UiSelect"

const searchTerm = defineModel<string>("searchTerm", { default: "" })
const sortType = defineModel<string>("sortType", { default: "desc_createdAt" })
const mediaType = defineModel<MediaTypeEnum | "all">("mediaType", { default: "all" })

const { t } = useI18n()
const { searchValue } = useDebouncedSearchTerm(searchTerm)

const sortArrowUpIcon = h(UiIcon, { name: "icon:sort-arrow-up" })
const sortArrowDownIcon = h(UiIcon, { name: "icon:sort-arrow-down" })

const sortOptions = computed(() => {
  return [
    {
      label: t("releaseSubscription.sort.createdAt"),
      value: "asc_createdAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("releaseSubscription.sort.createdAt"),
      value: "desc_createdAt",
      icon: sortArrowDownIcon,
    },
    {
      label: t("releaseSubscription.sort.lastReleasedAt"),
      value: "asc_lastReleasedAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("releaseSubscription.sort.lastReleasedAt"),
      value: "desc_lastReleasedAt",
      icon: sortArrowDownIcon,
    },
  ]
})

const mediaTypeOptions = computed(() => {
  return [
    {
      label: t("ui.all"),
      value: "all",
    },
    {
      label: t("details.mediaType.movie"),
      value: MediaTypeEnum.MOVIE,
    },
    {
      label: t("details.mediaType.tv"),
      value: MediaTypeEnum.TV,
    },
  ]
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.search">
      <UiInput
        v-model="searchValue"
        :class="$style.search"
        size="small"
        :placeholder="$t('search.placeholder')"
      >
        <template #icon>
          <UiIcon name="icon:search" />
        </template>
      </UiInput>
    </div>

    <div :class="$style.filters">
      <UiDropdown
        align="end"
        :indent="12"
        :trigger-class="$style.dropdownTrigger"
      >
        <template #trigger>
          <UiIcon
            name="icon:sort"
            :size="20"
          />
        </template>

        <template #content>
          <UiDropdownItem
            v-for="option in sortOptions"
            :key="option.value"
            @click="sortType = option.value"
          >
            <template #iconStart>
              <component
                :is="option?.icon"
                v-if="option?.icon"
              />
            </template>
            <template #content>
              {{ option.label }}
            </template>
          </UiDropdownItem>
        </template>
      </UiDropdown>

      <UiSelect
        v-model="sortType"
        :class="$style.sortSelect"
        :width="224"
        :options="sortOptions"
      />
      <UiSelect
        v-model="mediaType"
        :width="125"
        :options="mediaTypeOptions"
        :placeholder="$t('ui.all')"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.search {
  max-width: 384px;
  width: 100%;

  @include mobileDevice {
    &,
    input {
      height: 40px !important;
    }
  }
}

.filters {
  flex: 1 1 auto;
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @include mobileDevice {
    gap: 10px;

    .sortSelect {
      display: none;
    }
  }

  .dropdownTrigger {
    display: none;

    @include mobileDevice {
      width: 38px;
      min-width: 38px;
      height: 38px;
      background: var(--c-card-background-hovered);
      border: 1px solid var(--c-stroke);
      border-radius: var(--s-border-radius-medium);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
