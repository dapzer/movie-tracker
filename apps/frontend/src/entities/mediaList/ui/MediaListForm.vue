<script setup lang="ts">
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { useForm, useI18n } from "#imports"
import { watch } from "vue"
import * as yup from "yup"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSwitch } from "~/shared/ui/UiSwitch"
import { UiTextarea } from "~/shared/ui/UiTextarea"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaListFormProps {
  initialValue?: MediaListUpdateApiTypes
  isSystem?: boolean
}

const props = defineProps<MediaListFormProps>()
const emit = defineEmits<{
  (e: "onSubmit", settings: MediaListUpdateApiTypes): void
}>()

const { t } = useI18n()

const { formValue, onFormSubmit, errors } = useForm({
  initialValue: props.initialValue ?? {
    title: "",
    description: "",
    isPublic: false,
  },
  onSubmit: (formValue) => {
    if (props.isSystem) {
      formValue.title = undefined
    }
    emit("onSubmit", formValue)
  },
  validationSchema: yup.object().shape({
    title: yup.string().trim().min(3, t("mediaList.errors.titleLength")),
    description: yup.string().nullable(),
    isPublic: yup.boolean().required(t("validation.required")),
  }),
})

watch(() => props.isSystem, (isSystem) => {
  if (isSystem) {
    formValue.value.title = t("mediaList.favorites")
  }
})
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="onFormSubmit"
  >
    <UiInput
      v-model="formValue.title"
      :disabled="props.isSystem"
      :error="errors?.title"
      maxlength="64"
      :placeholder="$t('mediaList.settingsForm.title')"
    />
    <UiTextarea
      v-model="formValue.description"
      :error="errors?.description"
      maxlength="256"
      :placeholder="$t('mediaList.settingsForm.description')"
    />

    <div :class="$style.switch">
      <UiTypography variant="description">
        {{ $t('mediaList.settingsForm.publicStatus') }}
      </UiTypography>
      <UiSwitch v-model="formValue.isPublic" />
    </div>

    <div :class="$style.actions">
      <slot name="actions" />
    </div>
  </form>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
