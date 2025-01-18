<script setup lang="ts">

import UiSocialList from "~/components/ui/UiSocialList/UiSocialList.vue"
</script>

<template>
  <Story
    title="UiSocialList"
    group="ui-kit"
  >
    <template #default>
      <UiSocialList
        :social-list="{
          github: 'user',
          facebook: 'user',
          twitter: 'user',
          instagram: 'user',
          youtube: 'user',
          telegram: 'user',
          tiktok: 'user',
          discord: 'user',
        }"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
