<script setup lang="ts">
import { useI18n } from "#imports"
import { getBytesFromMegabytes } from "@movie-tracker/utils"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import DataImportCard from "~/features/dataImport/ui/DataImportCard.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

const MAX_FILE_SIZE_BYTES = getBytesFromMegabytes(50)

const file = defineModel<File | null>()

const { t, locale } = useI18n()

const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const formattedFileSize = computed(() => {
  if (!file.value) {
    return ""
  }

  const sizeInMb = file.value.size / 1024 / 1024
  return `${sizeInMb.toLocaleString(locale.value, { maximumFractionDigits: 3 })} ${t("dataImport.dropzone.mb")}`
})

function validateAndSet(value?: File | null) {
  if (!value) {
    return
  }

  if (!value.name.toLowerCase().endsWith(".zip")) {
    toast.error(t("toasts.dataImport.invalidFileType"))
    return
  }

  if (value.size > MAX_FILE_SIZE_BYTES) {
    toast.error(t("toasts.dataImport.fileTooLarge"))
    return
  }

  file.value = value
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  validateAndSet(event.dataTransfer?.files?.[0])
}

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  validateAndSet(input.files?.[0])
  input.value = ""
}

function openFilePicker() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div>
    <input
      ref="fileInputRef"
      :class="$style.input"
      type="file"
      accept=".zip,application/zip,application/x-zip-compressed"
      @change="onInput"
    >

    <button
      v-if="!file"
      type="button"
      :class="[$style.dropzone, {
        [$style.dragOver]: isDragOver,
      }]"
      @click="openFilePicker"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <UiIcon
        :class="$style.dropzoneIcon"
        name="icon:upload"
        :size="16"
      />
      <div :class="$style.dropzoneText">
        <UiTypography
          variant="description"
          :class="$style.dropzoneHint"
        >
          {{ $t("dataImport.dropzone.hint") }}
        </UiTypography>
        <UiTypography
          variant="badge"
          :class="$style.dropzoneDescription"
        >
          {{ $t("dataImport.dropzone.description") }}
        </UiTypography>
      </div>
    </button>

    <DataImportCard
      v-else
      size="small"
      :class="$style.fileChip"
    >
      <div :class="$style.fileInfo">
        <div :class="$style.fileIconWrapper">
          <UiIcon
            name="icon:zip-file"
            :size="20"
          />
        </div>
        <div :class="$style.fileText">
          <UiTypography
            :class="$style.fileName"
            variant="description"
          >
            {{ file.name }}
          </UiTypography>
          <UiTypography
            variant="badge"
            :class="$style.fileSize"
          >
            {{ formattedFileSize }}
          </UiTypography>
        </div>
      </div>

      <UiButton
        size="small"
        scheme="gray"
        @click="openFilePicker"
      >
        {{ $t("dataImport.dropzone.replace") }}
      </UiButton>
    </DataImportCard>
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;
@use "~/shared/styles/breakpoints" as *;

.input {
  display: none;
}

.dropzone {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 1px dashed var(--c-stroke);
  border-radius: var(--s-border-radius-small);
  background: unset;
  cursor: pointer;
  text-align: center;
  transition:
    border-color 0.2s,
    background-color 0.2s;

  &:hover,
  &.dragOver {
    border-color: var(--c-label-link);
    background-color: var(--c-label-link-20);
  }

  .dropzoneText {
    max-width: 324px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dropzoneHint {
    color: var(--c-text);
  }

  .dropzoneIcon {
    color: var(--c-description);
  }

  .dropzoneDescription {
    color: var(--c-description);
  }
}

.fileChip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fileInfo {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.fileIconWrapper {
  background-color: var(--c-blue-20);
  padding: 8px;
  height: 36px;
}

.fileText {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.fileName {
  color: var(--c-text);
  @include ellipsisText();
}

.fileSize {
  color: var(--c-description);
}
</style>
