<script lang="ts" setup>
import type { UserType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UserRoleEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { useAuth } from "~/composables/useAuth"
import { UiDropdownGroup, UiDropdownItem, UiDropdownSeparator } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UserProfileDropdownProps {
  profile: UserType
}

const props = defineProps<UserProfileDropdownProps>()
const { handleLogout, isProcessingLogout } = useAuth()
const localePath = useLocalePath()

const isAdmin = computed(() => {
  return props.profile.roles.includes(UserRoleEnum.ADMIN)
})
</script>

<template>
  <div :class="$style.info">
    <UiImage
      :src="props.profile.image"
      fit="contain"
      fallback-src="/avatar.svg"
      height="36"
      width="36"
      alt="Avatar"
    />
    <div :class="$style.about">
      <UiTypography variant="label">
        {{ props.profile.name }}
      </UiTypography>
      <UiTypography :class="$style.email">
        {{ props.profile.email }}
      </UiTypography>
    </div>
  </div>

  <UiDropdownSeparator />

  <UiDropdownGroup>
    <UiDropdownItem
      v-if="isAdmin"
      :as="NuxtLink"
      :to="localePath('/dashboard')"
    >
      <template #content>
        {{ $t('dashboard.title') }}
      </template>
    </UiDropdownItem>
    <!-- TODO: show after implement page -->
    <UiDropdownItem
      v-if="false"
      :as="NuxtLink"
      :to="localePath('/settings')"
    >
      <template #iconStart>
        <UiIcon name="icon:settings" />
      </template>
      <template #content>
        {{ $t('navigation.accountSettings') }}
      </template>
    </UiDropdownItem>
    <UiDropdownItem
      :disabled="isProcessingLogout"
      @click="handleLogout"
    >
      <template #iconStart>
        <UiIcon name="icon:logout" />
      </template>
      <template #content>
        {{ $t('auth.signOut') }}
      </template>
    </UiDropdownItem>
  </UiDropdownGroup>
</template>

<style lang="scss" module>
@import "~/styles/mixins";

.info {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;

  .about {
    display: flex;
    flex-direction: column;
    max-width: max-content;
    width: 100%;

    p {
      @include ellipsisText();
    }

    .email {
      color: var(--c-description);
    }
  }

  img {
    height: 36px;
    width: 36px;
    border-radius: 50%;
  }
}
</style>
