<script setup lang="ts">
import { ref } from "vue"
import { UiMediaCard } from "~/shared/ui/UiCard"
import UiHoverCard from "~/shared/ui/UiHoverCard/UiHoverCard.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPlaceholderImageUrl } from "~/utils/getPlaceholderImageUrl"

const align = ref<"start" | "center" | "end">("start")
const side = ref<"top" | "right" | "bottom" | "left">("bottom")
</script>

<template>
  <Story
    group="ui-kit"
    title="UiHoverCord"
  >
    <template #default>
      <UiHoverCard
        :align="align"
        :side="side"
      >
        <template #trigger>
          <UiMediaCard
            :image-src="getPlaceholderImageUrl(179, 277)"
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
            :image-src="getPlaceholderImageUrl(179, 277)"
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
