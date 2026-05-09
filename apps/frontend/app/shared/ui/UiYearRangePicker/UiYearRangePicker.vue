<script setup lang="ts">
import { ref, watch } from "vue"
import { UiInput } from "~/shared/ui/UiInput"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiYearRangePickerProps {
  minYear?: number
  maxYear?: number
  shortcuts?: number[]
  fromLabel: string
  toLabel: string
  disabled?: boolean
}

const props = withDefaults(defineProps<UiYearRangePickerProps>(), {
  minYear: 1900,
  maxYear: () => new Date().getFullYear(),
  shortcuts: () => [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950],
})

const model = defineModel<[number | undefined, number | undefined]>({
  default: () => [undefined, undefined],
})

const fromInput = ref<string>(model.value[0] !== undefined ? String(model.value[0]) : "")
const toInput = ref<string>(model.value[1] !== undefined ? String(model.value[1]) : "")

function onFromBlur() {
  if (fromInput.value === "") {
    model.value = [undefined, model.value[1]]
    return
  }

  const num = Number.parseInt(fromInput.value)
  if (!Number.isNaN(num)) {
    let from = Math.min(Math.max(num, props.minYear), props.maxYear)
    let to = model.value[1]

    if (to !== undefined && from >= to) {
      to = Math.min(from + 1, props.maxYear)
      if (to <= from) {
        from = Math.max(props.minYear, to - 1)
      }
      if (toInput.value !== "") {
        toInput.value = String(to)
      }
    }

    model.value = [from, to]
    fromInput.value = String(from)
  }
}

function onToBlur() {
  if (toInput.value === "") {
    model.value = [model.value[0], undefined]
    return
  }

  const num = Number.parseInt(toInput.value)
  if (!Number.isNaN(num)) {
    let from = model.value[0]
    let to = Math.min(Math.max(num, props.minYear), props.maxYear)

    if (from !== undefined && to <= from) {
      from = to - 1
      if (from < props.minYear) {
        to = Math.min(props.minYear + 1, props.maxYear)
        from = to - 1
      }
      if (fromInput.value !== "") {
        fromInput.value = String(from)
      }
    }

    model.value = [from, to]
    toInput.value = String(to)
  }
}

function onKeydown(e: KeyboardEvent) {
  const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"]
  if (!allowed.includes(e.key) && !/^\d$/.test(e.key) && !(e.ctrlKey || e.metaKey)) {
    e.preventDefault()
  }
}

function applyDecadeShortcut(decade: number) {
  model.value = [decade, decade + 9]
  fromInput.value = String(decade)
  toInput.value = String(decade + 9)
}

watch(model, ([from, to]) => {
  if (from !== undefined) {
    fromInput.value = String(from)
  }
  else {
    fromInput.value = ""
  }

  if (to !== undefined) {
    toInput.value = String(to)
  }
  else {
    toInput.value = ""
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.inputs">
      <div :class="$style.inputGroup">
        <UiTypography
          variant="description"
          :class="$style.inputLabel"
        >
          {{ props.fromLabel }}
        </UiTypography>
        <UiInput
          v-model="fromInput"
          :disabled="props.disabled"
          size="small"
          :class="$style.input"
          type="number"
          :min="props.minYear"
          :max="model[1]"
          :placeholder="props.fromLabel"
          @blur="onFromBlur"
          @keydown="onKeydown"
        />
      </div>
      <div :class="$style.inputGroup">
        <UiTypography
          variant="description"
          :class="$style.inputLabel"
        >
          {{ props.toLabel }}
        </UiTypography>
        <UiInput
          v-model="toInput"
          :disabled="props.disabled"
          size="small"
          :class="$style.input"
          type="number"
          :min="model[0]"
          :max="props.maxYear"
          :placeholder="props.toLabel"
          @blur="onToBlur"
          @keydown="onKeydown"
        />
      </div>
    </div>

    <div :class="$style.shortcuts">
      <UiTag
        v-for="decade in props.shortcuts"
        :key="decade"
        as="button"
        :class="[$style.shortcut, {
          [$style.shortcutDisabled]: props.disabled,
        }]"
        type="button"
        text-variant="labelSmall"
        @click="applyDecadeShortcut(decade)"
      >
        {{ decade }}s
      </UiTag>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.inputs {
  display: flex;
  gap: 10px;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.inputLabel {
  font-size: var(--fs-badge);
  line-height: var(--lh-description);
  font-weight: var(--fw-medium);
  color: var(--c-white-60);
}

.input {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }

  appearance: textfield;
}

.shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.shortcut {
  color: var(--c-white-60);
  cursor: pointer;
}

.shortcutDisabled {
  opacity: var(--s-disabled-opacity);
  pointer-events: none;
}
</style>
