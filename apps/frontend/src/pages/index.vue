<script lang="ts" setup>
import { Feed } from "~/widgets/feed"
import { Hero } from "~/widgets/hero"
</script>

<template>
  <Hero />
  <Feed :class="$style.feed" />
</template>

<style lang="scss" module>
.feed {
  margin-top: 60px !important;
}
</style>
