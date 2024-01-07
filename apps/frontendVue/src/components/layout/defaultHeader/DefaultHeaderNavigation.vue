<script lang="ts" setup>
import SignInModal from "~/features/signIn/ui/SignInModal.vue";
import { UserProfileDropdown, UserProfileDropdownSkeleton } from "~/features/profile";
import UiButton from "~/components/ui/UiButton.vue";
import DefaultHeaderNavigationLinks from "~/components/layout/defaultHeader/DefaultHeaderNavigationLinks.vue";
import { useAuth, useGetMediaItemsApi, useGetMediaListsApi, watch } from "#imports";
import { useQueryClient } from "@tanstack/vue-query";
import { MediaItemQueryKeys, MediaListQueryKeys } from "~/constants/queryKeys";

interface DefaultHeaderNavigationProps {
  isMobileMenuOpen: boolean;
}

const props = defineProps<DefaultHeaderNavigationProps>();
const emit = defineEmits<{
  (e: "toggleMobileMenu"): void
}>();

const { profile, isLoadingProfile, isProfileSuccess } = useAuth();
const { data: mediaLists } = useGetMediaListsApi();
const { data: mediaItems } = useGetMediaItemsApi();

const queryClient = useQueryClient();

watch(isProfileSuccess, () => {
  if (isProfileSuccess) {
    queryClient.refetchQueries({ queryKey: [MediaListQueryKeys.GET_ALL] });
    queryClient.refetchQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] });
  }
});

</script>

<template>
  <div :class="$style.wrapper">
    <DefaultHeaderNavigationLinks :class="$style.list" />
    <UserProfileDropdownSkeleton v-if="isLoadingProfile" />
    <SignInModal v-if="!profile && !isLoadingProfile" />
    <UserProfileDropdown v-else />
    <UiButton
      :class="[$style.mobileMenuHandler, {
        [$style.mobileMenuHandlerActive]: props.isMobileMenuOpen
      }]"
      variant="clear"
      @click="emit('toggleMobileMenu')"
    >
      <span />
    </UiButton>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  display: flex;
  align-items: center;
  gap: 20px;

  .mobileMenuHandler {
    position: relative;
    height: 20px;
    width: 30px;
    display: none;
    align-items: center;

    span,
    &:before,
    &:after {
      display: block;
      top: 0;
      right: 0;
      background-color: #fff;
      height: 2px;
      width: 30px;
      transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
      border-radius: 2px;
    }

    &:before {
      content: "";
      position: absolute;
    }

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      top: unset;
    }

    &Active {
      span {
        display: none;
      }

      &:before {
        top: 50%;
        transform: rotate(405deg);
      }

      &:after {
        top: 50%;
        transform: rotate(-405deg);
      }
    }
  }

  @media screen and (max-width: $bp-md) {
    .mobileMenuHandler {
      display: flex;
    }

    .list {
      display: none;
    }
  }
}
</style>
