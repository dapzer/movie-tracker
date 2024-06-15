<script lang="ts" setup>

import { UiAvatar } from '~/components/newUi/UiAvatar';
import { UiTypography } from '~/components/newUi/UiTypography';

interface UiUserProfileLinkProps {
  userAvatarSrc?: string;
  userName: string;
  userUrl: string;
}

const props = defineProps<UiUserProfileLinkProps>();
</script>

<template>
  <NuxtLink
    :href="props.userUrl"
    :class="$style.wrapper"
  >
    <UiAvatar
      :src="props.userAvatarSrc"
      :size="24"
      :alt="`${props.userName} avatar`"
    />
    <UiTypography
      :class="$style.userName"
      variant="label"
    >
      {{ props.userName }}
    </UiTypography>
  </NuxtLink>
</template>

<style lang="scss" module>
@import '~/styles/mixins';

.wrapper {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;

  .userName {
    color: var(--c-description);
    @include ellipsisText;
  }
}
</style>
