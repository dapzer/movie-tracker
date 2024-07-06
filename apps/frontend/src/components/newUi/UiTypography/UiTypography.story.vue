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

const schema = ref(undefined);
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
          :schema="schema"
          :variant="variant"
        >
          {{ text }}
        </UiTypography>
      </Variant>
    </template>


    <template #controls>
      <HstText
        v-model="text"
        title="default slot"
      />
      <HstSelect
        v-model="schema"
        :options="[{
          value: undefined,
          label: 'default',
        },'link']"
        title="schema"
      />
    </template>
  </Story>
</template>
