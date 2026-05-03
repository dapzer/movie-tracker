<script setup lang="ts">
import { useI18n } from "#imports"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiRangeSlider } from "~/shared/ui/UiRangeSlider"
import { UiTypography } from "~/shared/ui/UiTypography"

const RATING_MIN = 0
const RATING_MAX = 10

const { t } = useI18n()

const rating = defineModel<[number, number]>({ default: () => [RATING_MIN, RATING_MAX] })
const openModel = ref(false)
const draftRating = ref<[number, number]>(rating.value)

const isActive = computed(() => {
  return rating.value[0] > RATING_MIN || rating.value[1] < RATING_MAX
})

function clearRating() {
  draftRating.value = [RATING_MIN, RATING_MAX]
  rating.value = [RATING_MIN, RATING_MAX]
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  rating.value = [draftRating.value[0], draftRating.value[1]]
})
</script>

<template>
  <UiPopover
    v-model="openModel"
    as-child
    :width="325"
    :indent="10"
    :content-spacing="16"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="clearRating"
      >
        {{ t("ui.rating.single") }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <div :class="$style.popoverContent">
        <UiTypography
          as="span"
          variant="label"
          :class="$style.caption"
        >
          {{ t("ui.rating.single") }}
        </UiTypography>
        <UiRangeSlider
          v-model="draftRating"
          :min="RATING_MIN"
          :max="RATING_MAX"
          :step="1"
        />
      </div>
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.popoverContent {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.caption {
  font-size: var(--fs-label-small);
}
</style>
