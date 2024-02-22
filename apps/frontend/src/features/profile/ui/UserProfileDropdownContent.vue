<script lang="ts" setup>
import type { UserType } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { useLogoutApi } from "~/composables/useAuthApi";
import { useAuth } from "~/composables/useAuth";
import { UserRoleEnum } from "@movie-tracker/types";
import { NuxtLink } from "#components";
import { useLocalePath } from "#i18n";
import { computed } from "vue";

interface UserProfileDropdownProps {
  profile: UserType;
}

const props = defineProps<UserProfileDropdownProps>();
const { handleLogout, isProcessingLogout } = useAuth();
const localePath = useLocalePath()

const isAdmin = computed(() => {
  return props.profile.roles.includes(UserRoleEnum.ADMIN);
});

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

    <UiTypography
      v-if="isAdmin"
      variant="link"
      :class="$style.link"
      :as="NuxtLink"
      :to="localePath('/dashboard')"
    >
      {{ $t("dashboard.title") }}
    </UiTypography>

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

  .link {
    font-size: var(--fs-span);
  }

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
