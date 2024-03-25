<script lang="ts" setup>
import { ref } from "vue";
import UiInput from "~/components/ui/UiInput.vue";
import UiSwitch from "~/components/ui/UiSwitch.vue";
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { useI18n, watch } from "#imports";
import UiFormActions from "~/components/ui/UiFormActions.vue";
import UiLabel from "~/components/ui/UiLabel.vue";

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
    <UiLabel :title="$t('mediaList.settingsForm.title')">
      <UiInput
        v-model="currentSettings.title"
        :disabled="props.isLoading || props.isSystem"
        :error="errors.title"
        :placeholder="$t('mediaList.settingsForm.titlePlaceholder')"
        maxlength="32"
        variant="boxed"
      />
    </UiLabel>
    <UiLabel :title="$t('mediaList.settingsForm.poster')">
      <UiInput
        v-model="currentSettings.poster"
        :disabled="props.isLoading"
        :placeholder="$t('mediaList.settingsForm.posterPlaceholder')"
        maxlength="256"
        variant="boxed"
      />
    </UiLabel>
    <UiLabel
      :title="$t('mediaList.settingsForm.publicStatus')"
      :class="$style.switch"
    >
      <UiSwitch
        v-model="currentSettings.isPublic"
        :is-disabled="props.isLoading"
      />
    </UiLabel>

    <UiFormActions
      :is-confirm-disabled="props.isLoading"
      :is-cancel-disabled="props.isLoading"
      :confirm-text="props.saveButtonText ?? $t('ui.actions.save')"
      @cancel="emit('onClickCancel')"
      @confirm="handleSubmit"
    />
  </form>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .switch {
    flex-direction: row;
    align-items: center;
    gap: 12px;

    label {
      display: flex;
    }
  }
}
</style>
