<script lang="ts" setup>
import UiTypography from "~/components/ui/UiTypography.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import UiInput from "~/components/ui/UiInput.vue";
import { ref } from "vue";

const v = ref("");

</script>

<template>
  <UiContainer>
    <UiTypography>{{ v }}</UiTypography>
    <UiInput v-model="v" />
  </UiContainer>
</template>

<style lang="scss" module></style>
