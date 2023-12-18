<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import type { UserType } from "@movie-tracker/types";

interface UserProfileDropdownTriggerProps {
  profile: UserType;
}

const props = defineProps<UserProfileDropdownTriggerProps>();
</script>

<template>
  <div
    v-if="!!profile"
    :class="$style.wrapper"
  >
    <UiTypography :class="$style.userName">
      {{ props.profile.name.split(" ")[0] }}
    </UiTypography>
    <NuxtImg
      :class="$style.avatar"
      :src="props.profile.image"
      fit="contain"
      height="32"
      width="32"
    />
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  display: flex;
  gap: 10px;
  align-items: center;

  .userName {
    color: var(--c-secondary);
    font-weight: var(--fw-light);

    @media screen and (max-width: $bp-md) {
      display: none;
    }
  }

  .avatar {
    max-width: 32px;
    border-radius: 50%;
  }
}
</style>
