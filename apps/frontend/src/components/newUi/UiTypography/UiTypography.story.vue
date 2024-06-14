<script lang="ts" setup>

import { ref } from 'vue';
import UiTypography, { type TypographyVariant } from './UiTypography.vue';

const text = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

const variants: TypographyVariant[] = [
  'text',
  'title',
  'title2',
  'title3',
  'title4',
  'subheading',
  'label',
  'listTitle',
  'cardTitle',
  'description',
  'badge',
];
</script>

<template>
  <Story>
    <template #default>
      <Variant
        v-for="variant in variants"
        :key="variant"
        :title="variant"
      >
        <UiTypography
          :variant="variant"
        >
          {{ text }}
        </UiTypography>
      </Variant>
      \
    </template>


    <template #controls>
      <HstText
        v-model="text"
        title="default slot"
      />
    </template>
  </Story>
</template>
