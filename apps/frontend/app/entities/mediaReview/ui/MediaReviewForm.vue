<script setup lang="ts">
import type { MediaReview, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import type { CreateMediaReviewBody } from "~/api/mediaReviews/mediaReviewsApiTypes"
import { useI18n } from "#imports"
import { MediaReviewStatus } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import * as yup from "yup"
import {
  useCreateMediaRatingApi,
  useDeleteMediaRatingApi,
  useGetMediaRatingByMediaIdApi,
  useUpdateMediaRatingApi,
} from "~/api/mediaRatings/useMediaRatingsApi"
import {
  useCreateMediaReviewApi,
  useDeleteMediaReviewApi,
  useUpdateMediaReviewApi,
} from "~/api/mediaReviews/useMediaReviewsApi"
import { useAuth } from "~/shared/composables/useAuth"
import { useForm } from "~/shared/composables/useForm"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiButton } from "~/shared/ui/UiButton"
import { UiConfirmationModal } from "~/shared/ui/UiConfirmationModal"
import { UiInput } from "~/shared/ui/UiInput"
import { UiStarsList } from "~/shared/ui/UiStarsList"
import { UiTextarea } from "~/shared/ui/UiTextarea"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaReviewFormProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum
  currentReview?: MediaReview
}

const props = defineProps<MediaReviewFormProps>()

const emits = defineEmits<{
  (event: "onCancel"): void
  (event: "onSuccess"): void
}>()
const getMediaRatingApi = useGetMediaRatingByMediaIdApi({
  mediaId: props.mediaId,
})
const { profile } = useAuth()
const { t } = useI18n()

const selectedRating = ref<number | undefined>(getMediaRatingApi.data.value?.rating)
const hoveredRating = ref<number | undefined>(undefined)

const createMediaReviewApi = useCreateMediaReviewApi()
const updateMediaReviewApi = useUpdateMediaReviewApi()
const deleteMediaReviewApi = useDeleteMediaReviewApi()
const createMediaRatingApi = useCreateMediaRatingApi()
const updateMediaRatingApi = useUpdateMediaRatingApi()
const deleteMediaRatingApi = useDeleteMediaRatingApi()

const initialValue = computed(() => {
  if (props.currentReview?.status === MediaReviewStatus.DRAFT) {
    return {
      title: props.currentReview.title,
      content: props.currentReview.content,
      isSpoiler: props.currentReview.isSpoiler,
    }
  }

  return {
    title: "",
    content: "",
    isSpoiler: false,
  }
})

const { formValue, onFormSubmit, errors } = useForm<Pick<CreateMediaReviewBody, "title" | "content" | "isSpoiler">>({
  initialValue: initialValue.value,
  onSubmit: async (formValue) => {
    const currentRating = getMediaRatingApi.data.value
    // TODO: Wrap into  try catch and extract to separate function
    if (selectedRating.value !== currentRating?.rating) {
      if (selectedRating.value && currentRating?.rating) {
        await updateMediaRatingApi.mutateAsync({
          id: currentRating.id,
          body: {
            rating: selectedRating.value,
          },
        })
      }
      else if (selectedRating.value && !currentRating?.rating) {
        await createMediaRatingApi.mutateAsync({
          rating: selectedRating.value,
          mediaId: props.mediaId,
          mediaType: props.mediaType as unknown as MediaTypeEnum,
        })
      }
      else if (!selectedRating.value && currentRating?.rating) {
        await deleteMediaRatingApi.mutateAsync({ id: currentRating.id })
      }
    }

    if (props.currentReview) {
      await updateMediaReviewApi.mutateAsync({
        id: props.currentReview.id,
        body: {
          ...formValue,
          status: MediaReviewStatus.PENDING,
        },
      }).then(() => {
        toast.success(t("toasts.mediaReview.successUpdated"))
      }).catch(() => {
        toast.error(t("toasts.mediaReview.unsuccessfullyUpdated"))
      })
    }
    else {
      await createMediaReviewApi.mutateAsync({
        ...formValue,
        status: MediaReviewStatus.PENDING,
        mediaId: props.mediaId,
        mediaType: props.mediaType as unknown as MediaTypeEnum,
      }).then(() => {
        toast.success(t("toasts.mediaReview.successCreated"))
      }).catch(() => {
        toast.error(t("toasts.mediaReview.unsuccessfullyCreated"))
      })
    }

    emits("onSuccess")
  },
  validationSchema: yup.object().shape({
    title: yup.string(),
    content:
        yup.string().min(5, t("validation.minLength", { min: 5 })).max(10000, t("validation.maxLength", { max: "10 000" })).required(t("validation.required")),
  }),
})

async function handleCancel() {
  if (props.currentReview) {
    await deleteMediaReviewApi.mutateAsync({ id: props.currentReview.id })
      .then(() => {
        toast.success(t("toasts.mediaReview.successDeleted"))
      })
      .catch(() => {
        toast.error(t("toasts.mediaReview.unsuccessfullyDeleted"))
      })
  }
  emits("onCancel")
}

const isLoading = computed(() => {
  return createMediaReviewApi.isPending.value || updateMediaReviewApi.isPending.value
})
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="onFormSubmit"
  >
    <UiAvatar
      :size="44"
      :src="profile?.image"
      :placeholder-id="profile?.id"
      :alt="profile?.name"
    />
    <div :class="$style.content">
      <div :class="$style.rating">
        <UiTypography variant="subheading">
          {{ $t("mediaReviews.yourRating") }}
        </UiTypography>
        <div>
          <UiStarsList
            v-model="selectedRating"
            v-model:hovered-rating="hoveredRating"
            :size="20"
          />
          <UiTypography v-if="hoveredRating || selectedRating">
            {{ hoveredRating || selectedRating }}
          </UiTypography>
        </div>
      </div>

      <UiInput
        v-model="formValue.title"
        :placeholder="$t('mediaReviews.form.title')"
        :error="errors?.conent"
      />
      <UiTextarea
        v-model="formValue.content"
        :error="errors?.content"
        :placeholder="$t('mediaReviews.form.content')"
        :description="$t('mediaReviews.form.contentDescription')"
      />

      <div :class="$style.actions">
        <UiConfirmationModal
          :title="$t('mediaReviews.form.confirmDeleteTitle')"
          :description="$t('mediaReviews.form.confirmDeleteDescription')"
          :confirm-text="$t('ui.yes')"
          :cancel-text="$t('ui.no')"
          scheme="danger"
          @confirm="handleCancel"
        >
          <template #trigger="{ openModal }">
            <UiButton
              :disabled="isLoading"
              variant="outlined"
              type="button"
              @click="openModal"
            >
              {{ $t('ui.actions.cancel') }}
            </UiButton>
          </template>
        </UiConfirmationModal>
        <UiButton type="action">
          {{ $t("mediaReviews.form.publish") }}
        </UiButton>
      </div>
    </div>
  </form>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: var(--c-review-card-background);

  @include mobilePlusDevice() {
    flex-direction: column;
    padding: 16px;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating {
  display: flex;
  align-items: flex-start;
  gap: 24px;

  @include mobilePlusDevice() {
    flex-direction: column;
    gap: 4px;
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
