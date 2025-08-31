<script lang="ts" setup>
import type { UiTypographyVariant } from "./UiTypography.vue"
import { ref } from "vue"
import UiTypography from "./UiTypography.vue"

const text = ref("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")

const variants: UiTypographyVariant[] = [
  "text",
  "title",
  "title2",
  "title3",
  "title4",
  "subheading",
  "label",
  "listTitle",
  "cardTitle",
  "description",
  "badge",
]

const schema = ref(undefined)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiTypography"
  >
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
        }, 'link']"
        title="schema"
      />
    </template>
  </Story>
</template>
