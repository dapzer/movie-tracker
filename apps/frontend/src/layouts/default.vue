<script lang="ts" setup>

import { DefaultHeader } from "~/widgets/header"
import { DefaultFooter } from "~/widgets/footer"
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
