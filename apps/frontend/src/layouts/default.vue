<script lang="ts" setup>
import { DefaultFooter } from "~/widgets/footer"
import { DefaultHeader } from "~/widgets/header"
import { UiLayoutWrapper } from "../shared/ui/UiLayoutWrapper"
</script>

<template>
  <UiLayoutWrapper>
    <DefaultHeader />
    <main>
      <slot />
    </main>
    <DefaultFooter />
  </UiLayoutWrapper>
</template>
