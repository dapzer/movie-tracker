<script lang="ts" setup>
import { NuxtLink } from "#components"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiUserProfileLinkProps {
  userAvatarSrc?: string
  userId: string
  userName: string
  userPageUrl?: string
}

const props = defineProps<UiUserProfileLinkProps>()
</script>

<template>
  <component
    :is="props.userPageUrl ? NuxtLink : 'div'"
    :href="props.userPageUrl || null"
    :class="$style.wrapper"
  >
    <UiAvatar
      :src="props.userAvatarSrc"
      :placeholder-id="props.userId"
      :size="24"
      :alt="`${props.userName} avatar`"
    />
    <UiTypography
      :class="$style.userName"
      variant="label"
    >
      {{ props.userName }}
    </UiTypography>
  </component>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  .userName {
    color: var(--c-description);
    @include ellipsisText;
  }
}
</style>
