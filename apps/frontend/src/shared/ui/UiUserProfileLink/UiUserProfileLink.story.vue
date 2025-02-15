<script setup lang="ts">

import UiUserProfileLink from '~/shared/ui/UiUserProfileLink/UiUserProfileLink.vue';
import UiUserProfileLinkSkeleton from "~/shared/ui/UiUserProfileLink/UiUserProfileLinkSkeleton.vue"

const currentLocation = window?.location.href;
</script>

<template>
  <Story
    group="ui-kit"
    title="UiUserProfileLink"
  >
    <template #default>
      <Variant title="Default">
        <UiUserProfileLink
          user-id="randomId"
          user-name="UserName"
          :user-url="currentLocation"
        />
      </Variant>
      <Variant title="Skeleton">
        <UiUserProfileLinkSkeleton />
      </Variant>
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
