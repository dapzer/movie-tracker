<script setup lang="ts">
import { definePageMeta } from "#imports"
// We need to define a page meta with a validate function that always returns false to prevent this page from being accessed directly.
definePageMeta({
  validate: () => false,
})
</script>

<template>
  <div />
</template>
