<script lang="ts" setup>

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { UiMediaCard } from '~/components/newUi/UiCard/mediaCard';
</script>

<template>
  <Story title="UiCard">
    <template #default>
      <Variant
        title="Base"
      >
        <UiCardBase>
          <template #image>
            <img
              alt="placeholder"
              src="https://via.placeholder.com/179x277"
            >
          </template>
          <template #content>
            <UiTypography variant="cardTitle">
              Card Title
            </UiTypography>
          </template>
        </UiCardBase>
      </Variant>

      <Variant
        title="MediaCard"
      >
        <UiMediaCard
          image="https://via.placeholder.com/179x277"
          description="Jan 07 2024, USA"
          title="Movie Title"
        />
      </Variant>
    </template>
  </Story>
</template>

<style lang="scss" module>

</style>
