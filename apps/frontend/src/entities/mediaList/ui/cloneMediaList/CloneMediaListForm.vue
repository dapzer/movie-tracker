<script setup lang="ts">
import type { MediaItemType, MediaListType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import * as yup from "yup"
import { useCreateMediaListCloneApi } from "~/api/mediaList/useMediaListApi"
import { useForm } from "~/shared/composables/useForm"
import { UiButton } from "~/shared/ui/UiButton"
import { UiFormListItem } from "~/shared/ui/UiFormListItem"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSwitch } from "~/shared/ui/UiSwitch"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"

interface CloneMediaListFormProps {
  mediaList: MediaListType
  mediaItems: MediaItemType[]
}

const props = defineProps<CloneMediaListFormProps>()
const model = defineModel<boolean>()
const createMediaListCloneApi = useCreateMediaListCloneApi()
const { t } = useI18n()

const { formValue, onFormSubmit, errors } = useForm({
  initialValue: {
    title: "",
    isKeepStatus: false,
    selectedStatuses: [],
  },
  onSubmit: (formValue) => {
    createMediaListCloneApi.mutateAsync({
      mediaListId: props.mediaList?.id,
      body: {
        title: formValue.title,
        selectedStatuses: formValue.selectedStatuses,
        isKeepStatus: formValue.isKeepStatus,
      },
    }).then(() => {
      model.value = false
      toast.success(t("mediaList.createClone.success"))
    }).catch(() => {
      toast.error(t("mediaList.createClone.unsuccessfully"))
    })
  },
  validationSchema: yup.object().shape({
    title: yup.string().trim().min(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, t("mediaList.errors.titleLength")),
  }),
})

const groupedByStatus = computed(() => {
  const result: Record<MediaItemStatusNameEnum, MediaItemType[]> = {
    [MediaItemStatusNameEnum.WATCHING_NOW]: [],
    [MediaItemStatusNameEnum.NOT_VIEWED]: [],
    [MediaItemStatusNameEnum.WAIT_NEW_PART]: [],
    [MediaItemStatusNameEnum.VIEWED]: [],
  }

  for (const item of props.mediaItems) {
    result[item.trackingData.currentStatus].push(item)
  }

  return result
})

const availableStatuses = computed(() => {
  const res = []

  for (const key in groupedByStatus.value) {
    if (groupedByStatus.value[key as MediaItemStatusNameEnum].length > 0) {
      res.push(key)
    }
  }

  return res
})
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="onFormSubmit"
  >
    <div :class="$style.list">
      <UiFormListItem
        v-for="status in availableStatuses"
        :key="status"
        v-model="formValue.selectedStatuses"
        :value="status"
        :title="$t(`mediaItem.status.${status}`) "
        :description="`${groupedByStatus[status as MediaItemStatusNameEnum].length} ${$t(getElementDeclensionTranslationKey(groupedByStatus[status as MediaItemStatusNameEnum].length))}`"
      />
    </div>

    <div :class="$style.switch">
      <UiTypography variant="description">
        {{ $t('mediaList.createClone.keepStatus') }}
      </UiTypography>
      <UiSwitch v-model="formValue.isKeepStatus" />
    </div>

    <UiInput
      v-model="formValue.title"
      :error="errors?.title"
      :maxlength="MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT"
      :placeholder="$t('mediaList.settingsForm.title')"
    />

    <UiButton
      :disabled="createMediaListCloneApi.isPending.value || formValue.selectedStatuses.length === 0"
      size="small"
      type="submit"
    >
      {{ $t('mediaList.createClone.submit') }}
    </UiButton>
  </form>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .list {
    display: flex;
    flex-direction: column;
  }

  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  button {
    margin-left: auto;
  }
}
</style>
