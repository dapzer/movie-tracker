<script setup lang="ts">
import { ref } from "vue"
import UiHoverCard from "~/components/newUi/UiHoverCard/UiHoverCard.vue"
import { getPlaceholderImageUrl } from "~/utils/getPlaceholderImageUrl"
import { UiMediaCard } from "~/components/newUi/UiCard"
import UiTypography from "~/components/ui/UiTypography.vue"

const align = ref<'start' | 'center' | 'end'>('start')
const side = ref<'top' | 'right' | 'bottom' | 'left'>('bottom')
</script>

<template>
  <Story title="UiHoverCord">
    <template #default>
      <UiHoverCard
        :align="align"
        :side="side"
      >
        <template #trigger>
          <UiMediaCard
            :imageSrc="getPlaceholderImageUrl(179, 277)"
            description="Jan 07 2024, USA"
            title="Movie Title"
            link-url=""
          />
        </template>
        <template #content>
          <UiTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </UiTypography>
          <UiTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </UiTypography>
        </template>
      </UiHoverCard>

      <UiHoverCard
        :class="$style.right"
        :align="align"
        :side="side"
      >
        <template #trigger>
          <UiMediaCard
            :imageSrc="getPlaceholderImageUrl(179, 277)"
            description="Jan 07 2024, USA"
            title="Movie Title"
            link-url=""
          />
        </template>
        <template #content>
          <UiTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </UiTypography>
          <UiTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </UiTypography>
        </template>
      </UiHoverCard>
    </template>

    <template #controls>
      <HstSelect
        v-model="align"
        title="Align"
        :options="['start', 'center', 'end']"
      />
      <HstSelect
        v-model="side"
        title="Side"
        :options="['top', 'right', 'bottom', 'left']"
      />
    </template>
  </Story>
</template>

<style module lang="scss">
.right {
  margin-left: 100%;
}
</style>
