<script setup lang="ts">
import { useForm, useI18n } from "#imports"
import { watch } from "vue"
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import * as yup from "yup"
import { UiInput } from "~/components/newUi/UiInput"
import { UiTextarea } from "~/components/newUi/UiTextarea"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiSwitch } from "~/components/newUi/UiSwitch"

interface MediaListFormProps {
  initialValue?: MediaListUpdateApiTypes;
  isSystem?: boolean;
}

const props = defineProps<MediaListFormProps>();
const emit = defineEmits<{
  (e: "onSubmit", settings: MediaListUpdateApiTypes): void;
}>();

const { t } = useI18n();

const { formValue, onFormSubmit, errors } = useForm({
  initialValue: props.initialValue ?? {
    title: "",
    isPublic: false
  },
  onSubmit: (formValue) => {
    if (props.isSystem) {
      formValue.title = '';
    }
    emit("onSubmit", formValue);
  },
  validationSchema: yup.object().shape({
    title: yup.string().min(3, t('mediaList.errors.titleLength')),
    // description: yup.string().required(t("validation.required")),
    isPublic: yup.boolean().required(t("validation.required"))
  })
})

watch(() => props.isSystem, (isSystem) => {
  if (isSystem) {
    formValue.value.title = t("mediaList.favorites");
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
      maxlength="32"
      :placeholder="$t('mediaList.settingsForm.title')"
    />
    <UiTextarea
      disabled
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
