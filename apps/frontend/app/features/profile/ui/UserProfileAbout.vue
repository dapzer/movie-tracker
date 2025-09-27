<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getMonthNameLocaleKey } from "~/shared/utils/getMonthNameLocaleKey"

interface UserProfileAboutProps {
  user: UserPublicType
}

const props = defineProps<UserProfileAboutProps>()

const { t } = useI18n()

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
      <UiTypography variant="description">
        {{ $t("userProfile.trackSince", { date: trackSince }) }}
      </UiTypography>
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

.name {
  @include ellipsisText();
}
</style>
