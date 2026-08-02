<script setup lang="ts">
import type { MediaReviewSortField, SortOrderEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import type { UiOptionPickerOption } from "~/shared/ui/UiOptionPicker"
import { computed, useI18n } from "#imports"
import { MediaReviewStatus } from "@movie-tracker/types"
import { h, ref, watch } from "vue"
import {
  useGetMediaReviewByCurrentUserAndMediaIdApi,
  useGetMediaReviewsByMediaIdApi,
} from "~/api/mediaReviews/useMediaReviewsApi"
import {
  MediaReviewCard,
  MediaReviewCardSkeleton,
  MediaReviewCardStatused,
  MediaReviewForm,
} from "~/entities/mediaReview"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiOptionPicker } from "~/shared/ui/UiOptionPicker"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTooltip } from "~/shared/ui/UiTooltip"
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
const { profile, isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()

const { t } = useI18n()

type ReviewSortValue
  = "createdAt_desc"
    | "createdAt_asc"
    | "likesCount_desc"
    | "likesCount_asc"
    | "dislikesCount_desc"
    | "dislikesCount_asc"

const currentSort = ref<ReviewSortValue>("createdAt_desc")
const reviewsItemsPerPage = 10

const getMediaReviewsByMediaIdApiQueries = computed(() => {
  const [sortBy, sortDirection] = currentSort.value.split("_") as [MediaReviewSortField, SortOrderEnum]

  return {
    mediaId: props.mediaId,
    sortBy,
    sortDirection,
    ...getPaginationParams({
      itemsPerPage: reviewsItemsPerPage,
      page: currentPage.value,
    }),
  }
})

const getMediaReviewsByMediaIdApi = useGetMediaReviewsByMediaIdApi(getMediaReviewsByMediaIdApiQueries)

const getMediaReviewByCurrentUserAndMediaIdApiArgs = computed(() => {
  return {
    mediaId: props.mediaId,
  }
})

const getMediaReviewByCurrentUserAndMediaIdApi = useGetMediaReviewByCurrentUserAndMediaIdApi(getMediaReviewByCurrentUserAndMediaIdApiArgs)

await Promise.all([
  getMediaReviewsByMediaIdApi.suspense(),
  getMediaReviewByCurrentUserAndMediaIdApi.suspense(),
])

const sortArrowUpIcon = h(UiIcon, { name: "icon:sort-arrow-up" })
const sortArrowDownIcon = h(UiIcon, { name: "icon:sort-arrow-down" })

const sortOptions = computed<Array<UiOptionPickerOption>>(() => {
  return [
    { value: "createdAt_asc", label: t("mediaReview.sort.createdAt"), icon: sortArrowUpIcon },
    { value: "createdAt_desc", label: t("mediaReview.sort.createdAt"), icon: sortArrowDownIcon },
    { value: "likesCount_asc", label: t("mediaReview.sort.likes"), icon: sortArrowUpIcon },
    { value: "likesCount_desc", label: t("mediaReview.sort.likes"), icon: sortArrowDownIcon },
    { value: "dislikesCount_asc", label: t("mediaReview.sort.dislikes"), icon: sortArrowUpIcon },
    { value: "dislikesCount_desc", label: t("mediaReview.sort.dislikes"), icon: sortArrowDownIcon },
  ]
})

watch(currentSort, () => {
  currentPage.value = 1
})

const createFormVisible = ref<boolean>(false)

const currentReview = computed(() => {
  return getMediaReviewByCurrentUserAndMediaIdApi.data.value
})

const isShowStatusedCard = computed(() => {
  return currentReview.value && [MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING, MediaReviewStatus.REMOVED].includes(currentReview.value.status) && !createFormVisible.value
})

const data = computed(() => {
  return getMediaReviewsByMediaIdApi.data.value
})

const isPublishedReviewsExists = computed(() => {
  const data = getMediaReviewByCurrentUserAndMediaIdApi.data.value
  const status = data?.status
  return data && status !== MediaReviewStatus.DELETED
})

function handleOpenForm() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }
  createFormVisible.value = true
}

const isCreateButtonDisabled = computed(() => {
  return isPublishedReviewsExists.value || createFormVisible.value || profile.value?.isBanned
})
</script>

<template>
  <section>
    <div>
      <div :class="$style.title">
        <UiTypography
          variant="title3"
          as="h2"
        >
          {{ $t("mediaReview.title") }}
        </UiTypography>
        <UiTooltip
          :disabled="!isCreateButtonDisabled"
          side="bottom"
        >
          <template #trigger>
            <UiButton
              :disabled="isCreateButtonDisabled"
              variant="boxed"
              scheme="secondary"
              size="medium"
              with-icon
              @click="handleOpenForm"
            >
              <UiIcon
                name="icon:reviews-outlined"
                :size="20"
              />
              {{ $t("mediaReview.create") }}
            </UiButton>
          </template>
          <template #content>
            <UiTypography
              variant="description"
              :class="$style.tooltipTitle"
            >
              {{ $t(profile?.isBanned ? "mediaReview.createTooltipBanned" : "mediaReview.createTooltip") }}
            </UiTypography>
          </template>
        </UiTooltip>
      </div>
      <UiDivider :class="$style.headerDivider" />
      <div :class="$style.subheader">
        <UiTypography variant="description">
          {{ data?.totalCount || 0 }}
          {{ $t(getReviewDeclensionTranslationKey(data?.totalCount || 0)).toLocaleLowerCase() }}
        </UiTypography>
        <UiOptionPicker
          v-if="data?.totalCount"
          v-model="currentSort"
          :options="sortOptions"
          :width="220"
          compact-icon="icon:sort"
        />
      </div>
    </div>
    <div :class="$style.list">
      <MediaReviewForm
        v-if="createFormVisible"
        :media-id="props.mediaId"
        :media-type="props.mediaType"
        :current-review="currentReview"
        @on-cancel="createFormVisible = false"
        @on-success="createFormVisible = false"
      />
      <MediaReviewCardStatused
        v-if="isShowStatusedCard && currentReview"
        :media-review="currentReview"
        @on-edit-click="handleOpenForm"
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
        :title="$t('mediaReview.noReviews.title')"
        :description="$t('mediaReview.noReviews.description')"
        :indent="0"
        title-variant="subheading"
      >
        <UiTooltip
          side="bottom"
          :disabled="!isCreateButtonDisabled"
        >
          <template #trigger>
            <UiButton
              with-icon
              variant="text"
              scheme="link"
              :disabled="isCreateButtonDisabled"
              @click="handleOpenForm"
            >
              {{ $t('mediaReview.noReviews.action') }}
              <UiIcon name="icon:plus" />
            </UiButton>
          </template>
          <template #content>
            <UiTypography
              variant="description"
              :class="$style.tooltipTitle"
            >
              {{ $t(profile?.isBanned ? "mediaReview.createTooltipBanned" : "mediaReview.createTooltip") }}
            </UiTypography>
          </template>
        </UiTooltip>
      </UiAttention>
    </div>

    <template v-if="data?.totalCount && data.totalCount >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="reviewsItemsPerPage"
        :total-items="data.totalCount"
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
  gap: 16px;
  flex-wrap: wrap;
}

.subheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 30px;
}

.tooltipTitle {
  color: var(--c-text);
  font-weight: var(--fw-medium);
}
</style>
