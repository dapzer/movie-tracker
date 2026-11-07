<script setup lang="ts">
import type { ReleaseSubscriptionType, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateReleaseSubscriptionApi,
  useDeleteReleaseSubscriptionApi,
  useGetReleaseSubscriptionByMediaIdApi,
} from "~/api/releaseSubscriptions/useReleaseSubscriptionsApi"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiTooltip } from "~/shared/ui/UiTooltip"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaDetailsReleaseSubscriptionProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  releaseDate?: string
  title?: string
  subscription?: ReleaseSubscriptionType
}

const props = defineProps<MediaDetailsReleaseSubscriptionProps>()
const { t } = useI18n()
const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()

const getReleaseSubscriptionApi = useGetReleaseSubscriptionByMediaIdApi({
  mediaId: props.mediaId,
  mediaType: props.mediaType as MediaTypeEnum,
})
const createReleaseSubscriptionApi = useCreateReleaseSubscriptionApi()
const deleteReleaseSubscriptionApi = useDeleteReleaseSubscriptionApi()

const subscription = computed(() => {
  if (getReleaseSubscriptionApi.data.value === undefined) {
    return props.subscription
  }
  return getReleaseSubscriptionApi.data.value || undefined
})

const isPending = computed(() => {
  return createReleaseSubscriptionApi.isPending.value || deleteReleaseSubscriptionApi.isPending.value
})

const isReleased = computed(() => {
  if (!props.releaseDate)
    return false
  const releaseDate = new Date(props.releaseDate)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return releaseDate <= currentDate
})

const isDisabled = computed(() => {
  if (props.mediaType === MediaTypeEnum.TV) {
    return false
  }
  return isReleased.value && !subscription.value
})

const tooltipContent = computed(() => {
  if (isReleased.value && props.mediaType === MediaTypeEnum.MOVIE) {
    return t("releaseSubscription.tooltip.movie.alreadyReleased")
  }
  return t(`releaseSubscription.tooltip.${props.mediaType}.subscribe`, { title: props.title || "" })
})

async function handleSubscribeClick() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  if (subscription.value) {
    await deleteReleaseSubscriptionApi.mutateAsync({
      id: subscription.value.id,
    }).then(() => {
      toast.success(t(`toasts.releaseSubscription.${props.mediaType}.successUnsubscribed`))
    }).catch(() => {
      toast.error(t(`toasts.releaseSubscription.${props.mediaType}.unsuccessfullyUnsubscribed`))
    })
  }
  else {
    await createReleaseSubscriptionApi.mutateAsync({
      mediaId: props.mediaId,
      mediaType: props.mediaType as MediaTypeEnum,
    }).then(() => {
      toast.success(t(`toasts.releaseSubscription.${props.mediaType}.successSubscribed`))
    }).catch(() => {
      toast.error(t(`toasts.releaseSubscription.${props.mediaType}.unsuccessfullySubscribed`))
    })
  }
}
</script>

<template>
  <UiTooltip
    :disabled="!!subscription"
    side="bottom"
  >
    <template #trigger>
      <slot
        :subscription="subscription"
        :is-pending="isPending"
        :is-disabled="isDisabled"
        :handle-subscribe-click="handleSubscribeClick"
      />
    </template>
    <template #content>
      <div :class="$style.wrapper">
        <UiTypography
          :class="$style.title"
          variant="description"
        >
          {{ $t("releaseSubscription.tooltip.title") }}
        </UiTypography>
        <UiTypography
          :class="$style.description"
          variant="badge"
        >
          {{ tooltipContent }}
        </UiTypography>
      </div>
    </template>
  </UiTooltip>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  max-width: 272px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  color: var(--c-text);
  font-weight: var(--fw-medium);
}

.description {
  color: var(--c-white-60);
}
</style>
