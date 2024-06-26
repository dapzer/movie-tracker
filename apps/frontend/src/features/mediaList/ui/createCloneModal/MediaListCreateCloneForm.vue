<script lang="ts" setup>

import { MediaItemStatusNameEnum, type MediaItemType, type MediaListType } from "@movie-tracker/types";
import { computed, ref } from "vue";
import { useI18n, watch } from "#imports";
import UiDivider from "~/components/ui/UiDivider.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import MediaItemCreateCopyModalFormItem
  from "~/features/mediaItem/ui/createCloneModal/MediaItemCreateCloneModalFormItem.vue";
import UiLabel from "~/components/ui/UiLabel.vue";
import UiInput from "~/components/ui/UiInput.vue";
import UiSwitch from "~/components/ui/UiSwitch.vue";
import UiFormActions from "~/components/ui/UiFormActions.vue";
import { toast } from "vue3-toastify";
import { useCreateMediaListCloneApi } from "~/api/mediaList/useMediaListApi";

interface MediaListCreateCloneFormProps {
  mediaList?: MediaListType;
  mediaItems?: MediaItemType[];
  closeModal: () => void;
}

const props = defineProps<MediaListCreateCloneFormProps>();
const { t } = useI18n();
const selectedStatuses = ref<MediaItemStatusNameEnum[]>([]);
const createMediaListCloneApi = useCreateMediaListCloneApi();
const isKeepStatus = ref(false);
const title = ref(props.mediaList?.title ?? "");
const errors = ref({
  title: ""
});

const isCreatingClonePending = computed(() => {
  return createMediaListCloneApi.status.value === "pending";
});

const availableStatuses = computed(() => {
  return [...new Set(props.mediaItems?.map(item => item.trackingData.currentStatus) ?? [])];
});

const statusList = computed(() => {
  return Object.values(MediaItemStatusNameEnum).filter(status => availableStatuses.value.includes(status)) ?? [];
});

const handleCreateClone = async () => {
  if (!props.mediaList) return;

  if ((title.value || "").length < 3) {
    errors.value.title = t("mediaList.errors.titleLength");
    return;
  }

  createMediaListCloneApi.mutateAsync({
    mediaListId: props.mediaList?.id,
    body: {
      title: title.value,
      selectedStatuses: selectedStatuses.value,
      isKeepStatus: isKeepStatus.value
    }
  }).then(() => {
    props.closeModal();
    toast.success(t("mediaList.createClone.success"));
  });
};

watch(title, () => {
  errors.value.title = "";
});

watch(availableStatuses, () => {
  selectedStatuses.value = availableStatuses.value;
}, { immediate: true });

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography :class="$style.title">
      {{ $t("mediaList.createClone.description") }}
    </UiTypography>
    <UiDivider />
    <div :class="$style.list">
      <MediaItemCreateCopyModalFormItem
        v-for="status in statusList"
        :key="status"
        v-model="selectedStatuses"
        :disabled="isCreatingClonePending"
        :status="status"
      />
      <div :class="$style.listItem">
        <UiTypography>{{ $t("mediaList.createClone.keepStatus") }}</UiTypography>
        <UiSwitch
          v-model="isKeepStatus"
          :is-disabled="isCreatingClonePending"
        />
      </div>
    </div>
    <UiDivider />

    <UiLabel :title="$t('mediaList.settingsForm.title')">
      <UiInput
        v-model="title"
        :disabled="isCreatingClonePending"
        :error="errors.title"
        :placeholder="$t('mediaList.settingsForm.titlePlaceholder')"
        maxlength="32"
        variant="boxed"
      />
    </UiLabel>

    <UiFormActions
      :confirm-text="$t('mediaList.createClone.submit')"
      :is-cancel-disabled="isCreatingClonePending"
      :is-confirm-disabled="isCreatingClonePending || !selectedStatuses.length"
      @cancel="props.closeModal"
      @confirm="handleCreateClone"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    text-align: center;
    color: var(--c-secondary);
    font-weight: var(--fw-bold);
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }
}
</style>
