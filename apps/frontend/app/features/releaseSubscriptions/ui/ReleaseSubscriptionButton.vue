<script setup lang="ts">
import type { MediaTypeEnum, ReleaseSubscriptionType, TmdbMediaTypeEnum } from "@movie-tracker/types"
import type { UiButtonScheme, UiButtonVariant } from "~/shared/ui/UiButton"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateReleaseSubscriptionApi,
  useDeleteReleaseSubscriptionApi,
} from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface ReleaseSubscriptionButtonProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  subscription?: ReleaseSubscriptionType
  disabled?: boolean
}

const props = defineProps<ReleaseSubscriptionButtonProps>()

const { isAuthorized } = useAuth()
const { t } = useI18n()
const { navigateToSignInPage } = useNavigateToSignInPage()

const createReleaseSubscriptionApi = useCreateReleaseSubscriptionApi()
const deleteReleaseSubscriptionApi = useDeleteReleaseSubscriptionApi()

async function handleSubscribeClick() {
  if (props.subscription) {
    await deleteReleaseSubscriptionApi.mutateAsync({
      id: props.subscription.id,
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
  return props.subscription ? "light-gray" : "primary"
})

const variant = computed<UiButtonVariant>(() => {
  return props.subscription ? "boxed" : "outlined"
})
</script>

<template>
  <UiButton
    :scheme="scheme"
    :variant="variant"
    size="medium"
    with-icon
    :disabled="props.disabled || createReleaseSubscriptionApi.isPending.value
      || deleteReleaseSubscriptionApi.isPending.value"
    @click="isAuthorized ? handleSubscribeClick() : navigateToSignInPage()"
  >
    <UiIcon
      v-if="!props.subscription"
      name="icon:bell-outlined"
      :size="20"
    />
    <UiIcon
      v-else
      name="icon:bell"
      :size="16"
    />
    {{ props.subscription ? $t("releaseSubscription.unsubscribe") : $t("releaseSubscription.subscribe") }}
  </UiButton>
</template>
