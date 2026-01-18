<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import type { UiButtonScheme, UiButtonVariant } from "~/shared/ui/UiButton"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateReleaseSubscriptionApi,
  useDeleteReleaseSubscriptionApi,
  useGetReleaseSubscriptionByMediaIdApi,
} from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaDetailsReleaseSubscriptionProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  releaseDate?: string
}

const props = defineProps<MediaDetailsReleaseSubscriptionProps>()

const { isAuthorized } = useAuth()
const { t } = useI18n()
const { navigateToSignInPage } = useNavigateToSignInPage()

const getReleaseSubscriptionApi = useGetReleaseSubscriptionByMediaIdApi({
  mediaId: props.mediaId,
})
const createReleaseSubscriptionApi = useCreateReleaseSubscriptionApi()
const deleteReleaseSubscriptionApi = useDeleteReleaseSubscriptionApi()

async function handleSubscribeClick() {
  if (getReleaseSubscriptionApi.data.value) {
    await deleteReleaseSubscriptionApi.mutateAsync({
      id: getReleaseSubscriptionApi.data.value.id,
    }).then(() => {
      toast.success(t(`toasts.releaseSubscription.${props.mediaType}.successUnsubscribed`))
    }).catch(() => {
      toast.error(t(`toasts.releaseSubscription.${props.mediaType}.unsuccessfullyUnsubscribed`))
    })
  }
  else {
    await createReleaseSubscriptionApi.mutateAsync({
      mediaId: props.mediaId,
      mediaType: props.mediaType as unknown as MediaTypeEnum,
    }).then(() => {
      toast.success(t(`toasts.releaseSubscription.${props.mediaType}.successSubscribed`))
    }).catch(() => {
      toast.error(t(`toasts.releaseSubscription.${props.mediaType}.unsuccessfullySubscribed`))
    })
  }
}

const scheme = computed<UiButtonScheme>(() => {
  return getReleaseSubscriptionApi.data.value ? "light-gray" : "primary"
})

const variant = computed<UiButtonVariant>(() => {
  return getReleaseSubscriptionApi.data.value ? "boxed" : "outlined"
})

const isReleased = computed(() => {
  if (!props.releaseDate)
    return false
  const releaseDate = new Date(props.releaseDate)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return releaseDate <= currentDate
})
</script>

<template>
  <!-- TODO: Add tooltip -->
  <UiButton
    :scheme="scheme"
    :variant="variant"
    size="medium"
    with-icon
    :disabled="isReleased || createReleaseSubscriptionApi.isPending.value || deleteReleaseSubscriptionApi.isPending.value"
    @click="isAuthorized ? handleSubscribeClick() : navigateToSignInPage()"
  >
    <UiIcon
      v-if="!getReleaseSubscriptionApi.data.value"
      :class="[{
      }]"
      name="icon:bell-outlined"
      :size="20"
    />
    <UiIcon
      v-else
      name="icon:bell"
      :size="16"
    />
    {{ getReleaseSubscriptionApi.data.value ? $t("releaseSubscription.unsubscribe") : $t("releaseSubscription.subscribe") }}
  </UiButton>
</template>

<style module lang="scss">
.icon {
  color: var(--c-description);
}
</style>
