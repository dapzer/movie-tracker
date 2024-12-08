<script setup lang="ts">

import UiPagination from "~/components/ui/UiPagination/UiPagination.vue"
import { ref } from "vue"

const currentPage = ref(1)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiPagination"
  >
    <template #default>
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="10"
        :total-items="100"
      />
    </template>

    <template #controls>
      <HstNumber
        v-model="currentPage"
        :step="1"
        title="Current Page"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
