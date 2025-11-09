<script setup lang="ts">
import type { UserFollowInformationType, UserPublicType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useUserFollow } from "~/entities/userFollow/model/useUserFollow"
import { useAuth } from "~/shared/composables/useAuth"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getDeclensionTranslationKey } from "~/shared/utils/getDeclensionTranslationKey"
import { getMonthNameLocaleKey } from "~/shared/utils/getMonthNameLocaleKey"

interface UserProfileAboutProps {
  user: UserPublicType
  followInformation: UserFollowInformationType
}

const props = defineProps<UserProfileAboutProps>()

const { t } = useI18n()
const { profile } = useAuth()
const { handleFollow, isPending } = useUserFollow()

const trackSince = computed(() => {
  const date = new Date(props.user.createdAt)

  return `${t(getMonthNameLocaleKey(date, "genitive"))} ${date.getFullYear()}`
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiAvatar
      :src="props.user.image"
      :placeholder-id="props.user.id"
      :size="96"
      alt="User avatar"
    />
    <div :class="$style.details">
      <UiTypography
        as="h1"
        variant="title3"
        :class="$style.name"
      >
        {{ props.user.name }}
      </UiTypography>
      <div :class="$style.subtitleWrapper">
        <UiTypography variant="description">
          {{ props.followInformation.followersCount }} {{ $t(`ui.followers.${getDeclensionTranslationKey(props.followInformation.followersCount)}`, { date:
            trackSince }).toLowerCase() }}
        </UiTypography>
        <UiDelimiter schema="white" />
        <UiTypography variant="description">
          {{ $t("userProfile.trackSince", { date: trackSince }) }}
        </UiTypography>
      </div>
      <UiButton
        v-if="props.user.id !== profile?.id"
        :class="$style.followButton"
        size="medium"
        :scheme="props.followInformation.isFollowing ? 'gray' : 'primary'"
        :disabled="isPending"
        @click="handleFollow({
          userId: props.user.id,
          isFollowing: props.followInformation.isFollowing,
        })"
      >
        {{ props.followInformation.isFollowing ? $t("ui.unfollow") : $t("ui.follow") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  gap: 24px;
  min-width: 0;

  @include mobileDevice() {
    flex-direction: column;
    gap: 20px;
  }
}

.details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.subtitleWrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.followButton {
  margin-top: 12px;
  font-size: var(--fs-label-small);
}

.name {
  @include ellipsisText();
}
</style>
