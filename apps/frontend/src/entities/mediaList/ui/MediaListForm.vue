<script setup lang="ts">
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { useI18n } from "#imports"
import { MediaListAccessLevelEnum } from "@movie-tracker/types"
import { computed, h, watch } from "vue"
import * as yup from "yup"
import { useForm } from "~/shared/composables/useForm"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSelect } from "~/shared/ui/UiSelect"
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
    accessLevel: MediaListAccessLevelEnum.PRIVATE,
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
    accessLevel: yup.string().required(t("validation.required")),
  }),
})

watch(() => props.isSystem, (isSystem) => {
  if (isSystem) {
    formValue.value.title = t("mediaList.favorites")
  }
})

const privateAccessLevelIcon = h(UiIcon, { name: "icon:locker" })
const urlAccessLevelIcon = h(UiIcon, { name: "icon:link" })
const publicAccessLevelIcon = h(UiIcon, { name: "icon:shared-planet" })

const accessLevelOptions = computed(() => {
  return [
    {
      label: t("mediaList.settingsForm.accessLevel.private"),
      value: MediaListAccessLevelEnum.PRIVATE,
      icon: privateAccessLevelIcon,
    },
    {
      label: t("mediaList.settingsForm.accessLevel.url"),
      value: MediaListAccessLevelEnum.URL,
      icon: urlAccessLevelIcon,
    },
    {
      label: t("mediaList.settingsForm.accessLevel.public"),
      value: MediaListAccessLevelEnum.PUBLIC,
      icon: publicAccessLevelIcon,
    },
  ]
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
        {{ $t('mediaList.settingsForm.accessLevel.title') }}
      </UiTypography>
      <UiSelect
        v-model="formValue.accessLevel"
        value-gap-size="large"
        :width="172"
        :options="accessLevelOptions"
      />
    </div>

    <div :class="$style.actions">
      <slot name="actions" />
    </div>
  </form>
</template>

z<style module lang="scss">
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
