<script lang="ts" setup>
import { Hero } from "~/widgets/hero"
import { Feed } from "~/widgets/feed"
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
