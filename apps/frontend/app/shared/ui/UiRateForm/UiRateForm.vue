<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiStarsList } from "~/shared/ui/UiStarsList"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiRateFormProps {
  title: string
  currentRating?: number | null
  isPending?: boolean
}

interface UiRateFormEmits {
  (event: "submit", rating: number): void
  (event: "delete"): void
}

const props = withDefaults(defineProps<UiRateFormProps>(), {
  currentRating: null,
  isPending: false,
})
const emits = defineEmits<UiRateFormEmits>()

const selectedRating = ref<number | undefined>(props.currentRating ?? undefined)
const hoveredRating = ref<number | undefined>(undefined)
const hasRating = computed(() => props.currentRating !== null && props.currentRating !== undefined)

watch(() => props.currentRating, (rating) => {
  selectedRating.value = rating ?? undefined
})

function handleSubmit() {
  if (selectedRating.value === undefined) {
    return
  }

  emits("submit", selectedRating.value)
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography variant="description">
        {{ $t("mediaRating.howRate") }}
      </UiTypography>
      <UiTypography variant="title4">
        {{ props.title }}
      </UiTypography>
    </div>

    <div :class="$style.content">
      <div
        :class="[$style.result, {
          [$style.active]: selectedRating !== undefined,
        }]"
      >
        <UiTypography
          variant="title4"
          :class="$style.rating"
        >
          {{ hoveredRating ?? selectedRating ?? "?" }}
        </UiTypography>
      </div>
      <UiStarsList
        v-model="selectedRating"
        v-model:hovered-rating="hoveredRating"
        :disabled="props.isPending"
      />
    </div>
    <div :class="$style.actions">
      <UiButton
        v-if="hasRating"
        size="large"
        scheme="tertiary"
        :class="$style.submitButton"
        :disabled="props.isPending"
        with-icon
        @click="emits('delete')"
      >
        <UiIcon
          name="icon:trash"
          :size="19"
        />
        {{ $t("mediaRating.deleteRate") }}
      </UiButton>
      <UiButton
        size="large"
        :class="$style.submitButton"
        :disabled="props.isPending || selectedRating === undefined"
        @click="handleSubmit"
      >
        {{ hasRating ? $t("mediaRating.updateRate") : $t("mediaRating.rate") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.content {
  background-color: var(--c-header-footer-background);
  border-radius: 8px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.result {
  position: absolute;
  top: -14px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 34px;
  width: 64px;
  height: 28px;
  background: var(--c-description);

  p {
    font-family: var(--ff-inter);
  }

  &.active {
    background: var(--c-gold);

    p {
      color: var(--c-card-background-hovered);
    }
  }
}

.submitButton {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
