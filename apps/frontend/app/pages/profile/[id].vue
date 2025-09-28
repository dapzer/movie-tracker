<script setup lang="ts">
import { useRoute } from "#vue-router"
import { UserProfile } from "~/features/profile"

const { id = "" } = useRoute().params
</script>

<template>
  <UserProfile :user-id="id as string" />
</template>

<style scoped lang="scss">

</style>
