<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import type { UserType } from "@movie-tracker/types";

interface UserProfileDropdownTriggerProps {
  profile: UserType
}

const props = defineProps<UserProfileDropdownTriggerProps>()
</script>

<template>
  <div
    v-if="!!profile"
    :class="$style.wrapper"
  >
    <UiTypography :class="$style.userName">
      {{ props.profile.name.split(' ')[0] }}
    </UiTypography>
    <NuxtImg
      :class="$style.avatar"
      :src="props.profile.image"
      width="32"
      height="32"
      fit="contain"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 10px;
  align-items: center;

  .userName {
    color: var(--c-secondary);
    font-weight: var(--fw-light);
  }

  .avatar {
    max-width: 32px;
    border-radius: 50%;
  }
}
</style>
