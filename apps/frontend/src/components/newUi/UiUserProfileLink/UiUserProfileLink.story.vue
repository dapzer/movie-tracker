<script setup lang="ts">

import UiUserProfileLink from '~/components/newUi/UiUserProfileLink/UiUserProfileLink.vue';

const currentLocation = window?.location.href;
</script>

<template>
  <Story
    group="ui-kit"
    title="UiUserProfileLink"
  >
    <template #default>
      <UiUserProfileLink
        user-id="randomId"
        user-name="UserName"
        :user-url="currentLocation"
      />
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
