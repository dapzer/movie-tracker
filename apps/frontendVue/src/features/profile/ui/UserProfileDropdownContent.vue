<script lang="ts" setup>
import type { UserType } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { useLogoutApi } from "~/composables/useAuthApi";
import { useAuth } from "~/composables/useAuth";

interface UserProfileDropdownProps {
  profile: UserType;
}

const props = defineProps<UserProfileDropdownProps>();
const { handleLogout, isProcessingLogout } = useAuth();
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <UiTypography :class="$style.userName">
        {{ props.profile.name }}
      </UiTypography>
      <UiTypography
        :class="$style.email"
        variant="textSmall"
      >
        {{ props.profile.email }}
      </UiTypography>
    </div>
    <UiButton
      :class="$style.signOut"
      color-scheme="danger"
      :disabled="isProcessingLogout"
      @click="handleLogout()"
    >
      {{ $t("auth.signOut") }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .email,
    .userName {
      color: var(--c-secondary);
    }
  }

  .signOut {
    font-size: var(--fs-span);
  }
}
</style>
