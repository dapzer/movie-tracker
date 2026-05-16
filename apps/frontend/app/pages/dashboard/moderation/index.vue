<script lang="ts" setup>
import { UserRoleEnum } from "@movie-tracker/types"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "~/shared/ui/UiContainer"
import { MediaReviewsModeration } from "~/widgets/moderation"

useProtectedRoute([UserRoleEnum.ADMIN])
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MediaReviewsModeration />
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
