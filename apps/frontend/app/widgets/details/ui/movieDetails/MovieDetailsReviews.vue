<script setup lang="ts">
import type { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed } from "#imports"
import { ref } from "vue"
import {
  useGetMediaReviewByCurrentUserAndMediaIdApi,
  useGetMediaReviewsByMediaIdApi,
} from "~/api/mediaReviews/useMediaReviewsApi"
import { MediaReviewCard, MediaReviewCardSkeleton, MediaReviewForm } from "~/entities/mediaReview"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import { getReviewDeclensionTranslationKey } from "~/shared/utils/getReviewDeclensionTranslationKey"
import UiAttention from "../../../../shared/ui/UiAttention/UiAttention.vue"

interface MovieDetailsProducersProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum
}

const props = defineProps<MovieDetailsProducersProps>()

const currentPage = ref<number>(1)
const createFormVisible = ref<boolean>(false)

const getMediaReviewsByMediaIdApiQueries = computed(() => ({
  mediaId: props.mediaId,
  ...getPaginationParams({
    itemsPerPage: 10,
    page: currentPage.value,
  }),
}))

const getMediaReviewsByMediaIdApi = useGetMediaReviewsByMediaIdApi(getMediaReviewsByMediaIdApiQueries)

const getMediaReviewByCurrentUserAndMediaIdApiArgs = computed(() => ({
  mediaId: props.mediaId,
}))

const getMediaReviewByCurrentUserAndMediaIdApi = useGetMediaReviewByCurrentUserAndMediaIdApi(
  getMediaReviewByCurrentUserAndMediaIdApiArgs,
)

await Promise.all([
  getMediaReviewsByMediaIdApi.suspense(),
  getMediaReviewByCurrentUserAndMediaIdApi.suspense(),
])

const data = computed(() => {
  return getMediaReviewsByMediaIdApi.data.value
})
</script>

<template>
  <section :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.title">
        <UiTypography
          variant="title3"
          as="h2"
        >
          {{ $t("mediaReviews.title") }}
        </UiTypography>
        <UiButton
          :disabled="Boolean(getMediaReviewByCurrentUserAndMediaIdApi.data.value)"
          variant="boxed"
          scheme="secondary"
          size="medium"
          with-icon
          @click="createFormVisible = true"
        >
          <UiIcon
            name="icon:reviews-outlined"
            :size="20"
          />
          {{ $t("mediaReviews.create") }}
        </UiButton>
      </div>
      <UiDivider :class="$style.headerDivider" />
      <UiTypography variant="description">
        {{ data?.totalCount || 0 }} {{ $t(getReviewDeclensionTranslationKey(data?.totalCount || 0)).toLocaleLowerCase() }}
      </UiTypography>
    </div>
    <div :class="$style.list">
      <MediaReviewForm
        v-if="createFormVisible"
        :media-id="props.mediaId"
        :media-type="props.mediaType"
        :current-review="getMediaReviewByCurrentUserAndMediaIdApi.data.value"
        @on-cancel="createFormVisible = false"
        @on-success="createFormVisible = false"
      />
      <template v-if="!getMediaReviewsByMediaIdApi.isPending.value && data?.items.length">
        <MediaReviewCard
          v-for="review in data?.items || []"
          :key="review.id"
          :media-review="review"
        />
      </template>
      <template v-else-if="getMediaReviewsByMediaIdApi.isPending.value">
        <MediaReviewCardSkeleton
          v-for="i in 10"
          :key="i"
        />
      </template>
      <UiAttention
        v-else
        :title="$t('mediaReviews.noReviews')"
        :indent="0"
        title-variant="subheading"
      />
    </div>

    <template v-if="data?.totalCount && data.totalCount >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="20"
        :total-items="data.totalCount * getMediaReviewsByMediaIdApiQueries.limit!"
      />
    </template>
  </section>
</template>

<style module lang="scss">
.headerDivider {
  margin: 20px 0;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 30px;
}
</style>
