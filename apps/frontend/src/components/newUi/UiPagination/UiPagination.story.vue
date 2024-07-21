<script setup lang="ts">

import UiPagination from "~/components/newUi/UiPagination/UiPagination.vue"
import { ref } from "vue"

const currentPage = ref(1)
</script>

<template>
  <Story title="UiPagination">
    <template #default>
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="10"
        :total-pages="100"
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
