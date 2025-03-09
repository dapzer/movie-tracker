<script lang="ts" setup>
import type { UserType } from "@movie-tracker/types"
import { UiImage } from "~/shared/ui/UiImage"

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
    <UiImage
      :class="$style.avatar"
      :src="props.profile.image"
      fit="contain"
      fallback-src="/avatar.svg"
      height="36"
      width="36"
      alt="Avatar"
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
    height: 36px;
    width: 36px;
    border-radius: 50%;
  }
}
</style>
