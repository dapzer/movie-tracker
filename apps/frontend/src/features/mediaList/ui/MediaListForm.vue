<script lang="ts" setup>
import { ref } from "vue";
import UiInput from "~/components/ui/UiInput.vue";
import UiSwitch from "~/components/ui/UiSwitch.vue";
import UiButton from "~/components/ui/UiButton.vue";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";
import { useI18n, watch } from "#imports";

interface MediaListFormProps {
  isSystem?: boolean;
  initialValue: MediaListUpdateApiTypes;
  saveButtonText?: string;
  isLoading?: boolean;
}

const props = defineProps<MediaListFormProps>();
const emit = defineEmits<{
  (e: "onClickCancel"): void;
  (e: "onClickSave", settings: MediaListUpdateApiTypes): void;
}>();

const { t } = useI18n();
const currentSettings = ref({
  isPublic: props.initialValue.isPublic,
  title: props.initialValue.title,
  poster: props.initialValue.poster
});

const errors = ref({
  title: ""
});

watch(currentSettings, () => {
  errors.value.title = "";
}, { deep: true });

const handleSubmit = () => {
  if (!props.isSystem && (currentSettings.value.title || "").length < 3) {
    errors.value.title = t("mediaList.errors.titleLength");
    return;
  }

  emit("onClickSave", {
    isPublic: currentSettings.value.isPublic,
    poster: currentSettings.value.poster,
    ...(props.isSystem ? {} : { title: currentSettings.value.title })
  });
};
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="handleSubmit"
  >
    <label>
      {{ $t("mediaList.settingsForm.title") }}
      <UiInput
        v-model="currentSettings.title"
        :disabled="props.isLoading || props.isSystem"
        :error="errors.title"
        :placeholder="$t('mediaList.settingsForm.titlePlaceholder')"
        maxlength="32"
        variant="boxed"
      />
    </label>
    <label>
      {{ $t("mediaList.settingsForm.poster") }}
      <UiInput
        v-model="currentSettings.poster"
        :disabled="props.isLoading"
        :placeholder="$t('mediaList.settingsForm.posterPlaceholder')"
        maxlength="256"
        variant="boxed"
      />
    </label>
    <label :class="$style.switch">
      {{ $t("mediaList.settingsForm.publicStatus") }}
      <UiSwitch
        v-model="currentSettings.isPublic"
        :is-disabled="props.isLoading"
      />
    </label>

    <div :class="$style.actions">
      <UiButton
        :disabled="props.isLoading"
        color-scheme="success"
        type="submit"
      >
        {{ props.saveButtonText ?? $t("ui.actions.save") }}
      </UiButton>
      <UiButton
        :disabled="props.isLoading"
        color-scheme="danger"
        type="button"
        @click="emit('onClickCancel')"
      >
        {{ $t("ui.actions.cancel") }}
      </UiButton>
    </div>
  </form>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: var(--fs-h3);
    color: var(--c-secondary);

    input {
      border-radius: unset;
      padding: 6px 12px;
    }
  }

  .switch {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    padding-top: 20px;
  }
}
</style>
