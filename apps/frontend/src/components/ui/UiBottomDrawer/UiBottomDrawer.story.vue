<script setup lang="ts">

import UiBottomDrawer from "~/components/ui/UiBottomDrawer/UiBottomDrawer.vue"
import { UiButton } from "~/components/ui/UiButton"
import { UiTypography } from "~/components/ui/UiTypography"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiBottomDrawer"
  >
    <template #default>
      <UiBottomDrawer title="Some test title">
        <template #trigger>
          <UiButton>Open Drawer</UiButton>
        </template>
        <template #content>
          <UiTypography>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad consequuntur deserunt doloribus iusto magni
            odit saepe sed! Asperiores dolorum, eaque iusto maiores necessitatibus provident repudiandae? Autem
            consectetur doloremque eius!
          </UiTypography>
        </template>
      </UiBottomDrawer>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
