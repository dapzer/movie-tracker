<script setup lang="ts">
import type { DataImportListType, DataImportType, MediaItemStatusNameEnum } from "@movie-tracker/types"
import type { ProcessDataImportConfig } from "~/api/dataImport/dataImportApiTypes"
import type { DataImportProcessingListMode } from "~/features/dataImport/ui/processing/DataImportProcessingBucketCard.vue"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useRoute, useRouter } from "#vue-router"
import {
  DataImportStatusEnum,
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum as StatusEnum,
} from "@movie-tracker/types"
import { FetchError, getMillisecondsFromSeconds } from "@movie-tracker/utils"
import { computed, reactive, ref, watch } from "vue"
import { toast } from "vue3-toastify"
import { useGetDataImportByIdApi, useProcessDataImportApi } from "~/api/dataImport/useDataImportApi"
import { useGetMediaListsApi } from "~/api/mediaLists/useMediaListsApi"
import DataImportProcessingBucketCard from "~/features/dataImport/ui/processing/DataImportProcessingBucketCard.vue"
import DataImportProcessingFlagRow from "~/features/dataImport/ui/processing/DataImportProcessingFlagRow.vue"
import DataImportProcessingListCard from "~/features/dataImport/ui/processing/DataImportProcessingListCard.vue"
import DataImportProcessingSummary from "~/features/dataImport/ui/processing/DataImportProcessingSummary.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiBackLink } from "~/shared/ui/UiBackLink"
import { UiButton } from "~/shared/ui/UiButton"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

interface BucketFormState {
  enabled: boolean
  listMode: DataImportProcessingListMode
  newListTitle: string
  newListTitleError: string
  mediaListId: string
  status: MediaItemStatusNameEnum
}

interface ListFormState {
  id: string
  list: DataImportListType
  enabled: boolean
  listMode: DataImportProcessingListMode
  mediaListId: string
  status: MediaItemStatusNameEnum
}

const PROCESSING_REFETCH_INTERVAL_MS = getMillisecondsFromSeconds(2)

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const importId = route.params.id as string

const getDataImportByIdApi = useGetDataImportByIdApi(importId, {
  refetchInterval: (query: { state: { data: DataImportType | undefined } }) => query.state.data?.status === DataImportStatusEnum.PROCESSING
    ? PROCESSING_REFETCH_INTERVAL_MS
    : false,
})
const getMediaListsApi = useGetMediaListsApi()
const processDataImportApi = useProcessDataImportApi()

await Promise.all([
  getDataImportByIdApi.suspense(),
  getMediaListsApi.suspense(),
])

const dataImport = computed(() => getDataImportByIdApi.data.value)
const isEditable = computed(() => dataImport.value?.status === DataImportStatusEnum.PENDING)

const watchedBucket = reactive<BucketFormState>({
  enabled: false,
  listMode: "new",
  newListTitle: "",
  newListTitleError: "",
  mediaListId: "",
  status: StatusEnum.VIEWED,
})

const watchListBucket = reactive<BucketFormState>({
  enabled: false,
  listMode: "new",
  newListTitle: "",
  newListTitleError: "",
  mediaListId: "",
  status: StatusEnum.NOT_VIEWED,
})

const ratingsEnabled = ref(false)
const reviewsEnabled = ref(false)

const listsState = reactive<ListFormState[]>(
  dataImport.value?.result.lists.success.map(list => ({
    id: list.id,
    list,
    enabled: false,
    listMode: "new",
    mediaListId: "",
    status: StatusEnum.NOT_VIEWED,
  })) ?? [],
)

function isBucketValid(bucket: BucketFormState) {
  if (!bucket.enabled || bucket.listMode === "new") {
    return true
  }

  return !!bucket.mediaListId
}

function isListValid(list: ListFormState) {
  if (!list.enabled) {
    return true
  }

  return list.listMode === "new" || !!list.mediaListId
}

const isSubmitDisabled = computed(() => {
  if (!isEditable.value || processDataImportApi.isPending.value) {
    return true
  }

  const isSomethingSelected = watchedBucket.enabled
    || watchListBucket.enabled
    || ratingsEnabled.value
    || reviewsEnabled.value
    || listsState.some(list => list.enabled)

  return !isSomethingSelected
    || !isBucketValid(watchedBucket)
    || !isBucketValid(watchListBucket)
    || !listsState.every(isListValid)
})

function buildBucketConfig(bucket: BucketFormState) {
  return {
    status: bucket.status,
    ...(bucket.listMode === "new"
      ? { newListTitle: bucket.newListTitle.trim() }
      : { mediaListId: bucket.mediaListId }),
  }
}

function buildConfig(): ProcessDataImportConfig {
  const config: ProcessDataImportConfig = {}

  if (watchedBucket.enabled) {
    config.watched = buildBucketConfig(watchedBucket)
  }

  if (watchListBucket.enabled) {
    config.watchList = buildBucketConfig(watchListBucket)
  }

  if (ratingsEnabled.value) {
    config.ratings = true
  }

  if (reviewsEnabled.value) {
    config.reviews = true
  }

  const selectedLists = listsState
    .filter(list => list.enabled)
    .map(list => ({
      id: list.id,
      status: list.status,
      ...(list.listMode === "existing" && list.mediaListId ? { mediaListId: list.mediaListId } : {}),
    }))

  if (selectedLists.length) {
    config.lists = selectedLists
  }

  return config
}

watch(() => watchedBucket.newListTitle, () => {
  watchedBucket.newListTitleError = ""
})

watch(() => watchListBucket.newListTitle, () => {
  watchListBucket.newListTitleError = ""
})

function validateBucketTitles() {
  let isValid = true

  for (const bucket of [watchedBucket, watchListBucket]) {
    bucket.newListTitleError = ""

    if (!bucket.enabled || bucket.listMode !== "new") {
      continue
    }

    const titleLength = bucket.newListTitle.trim().length

    if (titleLength < MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT || titleLength > MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT) {
      bucket.newListTitleError = t("dataImport.processing.errors.listTitleLength", {
        min: MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
        max: MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
      })
      isValid = false
    }
  }

  return isValid
}

async function onSubmit() {
  if (!validateBucketTitles()) {
    return
  }

  try {
    await processDataImportApi.mutateAsync({
      id: importId,
      config: buildConfig(),
    })
    toast.success(t("toasts.dataImport.successProcessed"))
    router.push(localePath("/settings/data-import"))
  }
  catch (error) {
    if (error instanceof FetchError && error.statusCode === 429) {
      toast.error(t("toasts.rateLimitExceeded"))
    }
    else {
      toast.error(t("toasts.dataImport.unsuccessfullyProcessed"))
      await getDataImportByIdApi.refetch()
    }
  }
}
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <div :class="$style.header">
      <UiBackLink :url="localePath('/settings/data-import')" />

      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ $t("dataImport.processing.pageTitle") }}
      </UiTypography>

      <UiDivider />
    </div>

    <UiAttention
      v-if="getDataImportByIdApi.isError.value || !dataImport"
      :title="$t('dataImport.processing.attention.notFound.title')"
      :description="$t('dataImport.processing.attention.notFound.description')"
    />

    <div
      v-else
      :class="$style.content"
    >
      <DataImportProcessingSummary :data-import="dataImport" />

      <UiAttention
        v-if="!isEditable"
        :indent="0"
        :class="$style.statusAttention"
        :title="$t(`dataImport.processing.attention.${dataImport.status.toLowerCase()}.title`)"
        :description="$t(`dataImport.processing.attention.${dataImport.status.toLowerCase()}.description`)"
        title-variant="title4"
      />

      <UiDivider />

      <div :class="$style.form">
        <UiTypography
          as="h2"
          variant="cardTitle"
        >
          {{ $t("dataImport.processing.selectWhatToImport") }}
        </UiTypography>

        <DataImportProcessingBucketCard
          v-model:enabled="watchedBucket.enabled"
          v-model:list-mode="watchedBucket.listMode"
          v-model:new-list-title="watchedBucket.newListTitle"
          v-model:new-list-title-error="watchedBucket.newListTitleError"
          v-model:media-list-id="watchedBucket.mediaListId"
          v-model:status="watchedBucket.status"
          :title="$t('dataImport.processing.stats.watched')"
          :found-count="dataImport.result.watched.success.length"
          :failed-count="dataImport.result.watched.failed.length"
          :media-lists="getMediaListsApi.data.value"
          :disabled="!isEditable"
        />

        <DataImportProcessingBucketCard
          v-model:enabled="watchListBucket.enabled"
          v-model:list-mode="watchListBucket.listMode"
          v-model:new-list-title="watchListBucket.newListTitle"
          v-model:new-list-title-error="watchListBucket.newListTitleError"
          v-model:media-list-id="watchListBucket.mediaListId"
          v-model:status="watchListBucket.status"
          :title="$t('dataImport.processing.stats.watchList')"
          :found-count="dataImport.result.watchList.success.length"
          :failed-count="dataImport.result.watchList.failed.length"
          :media-lists="getMediaListsApi.data.value"
          :disabled="!isEditable"
        />

        <DataImportProcessingFlagRow
          v-model:enabled="ratingsEnabled"
          :title="$t('dataImport.processing.stats.ratings')"
          :found-count="dataImport.result.ratings.success.length"
          :failed-count="dataImport.result.ratings.failed.length"
          :disabled="!isEditable"
        />

        <DataImportProcessingFlagRow
          v-model:enabled="reviewsEnabled"
          :title="$t('dataImport.processing.stats.reviews')"
          :found-count="dataImport.result.reviews.success.length"
          :failed-count="dataImport.result.reviews.failed.length"
          :disabled="!isEditable"
        />

        <template v-if="dataImport.result.lists.success.length">
          <UiTypography
            as="h3"
            variant="cardTitle"
          >
            {{ $t("dataImport.processing.listsSection") }}
          </UiTypography>

          <DataImportProcessingListCard
            v-for="entry in listsState"
            :key="entry.id"
            v-model:enabled="entry.enabled"
            v-model:list-mode="entry.listMode"
            v-model:media-list-id="entry.mediaListId"
            v-model:status="entry.status"
            :list="entry.list"
            :media-lists="getMediaListsApi.data.value"
            :disabled="!isEditable"
          />
        </template>

        <UiButton
          v-if="isEditable"
          :class="$style.submitButton"
          :disabled="isSubmitDisabled"
          @click="onSubmit"
        >
          {{ $t("dataImport.processing.submit") }}
        </UiButton>
      </div>
    </div>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  max-width: 640px;
  margin-top: 60px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.statusAttention {
  margin: 0;
  align-items: flex-start;

  p {
    text-align: left;
  }
}

.submitButton {
  width: 100%;
  margin-top: 8px;
}
</style>
