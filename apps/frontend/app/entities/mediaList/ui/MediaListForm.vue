<script setup lang="ts">
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { useI18n } from "#imports"
import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
} from "@movie-tracker/types"
import { computed, h } from "vue"
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
    if (props.isSystem && !formValue.title) {
      formValue.title = undefined
    }
    emit("onSubmit", formValue)
  },
  validationSchema: yup.object().shape({
    title: yup.string().trim().test("length", t("mediaList.errors.titleLength"), (value) => {
      if (value === "" && props.isSystem) {
        return true
      }
      if (value === undefined) {
        return false
      }
      return value?.length >= MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT
    }).optional().nullable(),
    description: yup.string().nullable(),
    accessLevel: yup.string().required(t("validation.required")),
  }),
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
      :error="errors?.title"
      :maxlength="MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT"
      :placeholder="props.isSystem ? $t('mediaList.favorites') : $t('mediaList.settingsForm.title')"
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
