<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { NuxtLink } from "#components";
import { useLocalePath } from "#i18n";

interface UiLinkToDetailsProps {
  mediaId: number;
  mediaType?: string;
  title?: string;
}

const props = defineProps<UiLinkToDetailsProps>();
const localePath = useLocalePath();

</script>

<template>
  <UiTypography
    :class="$style.body"
    :as="NuxtLink"
    :to="localePath(`/details/${props.mediaType}/${props.mediaId}`)"
    variant="linkUnderlined"
  >
    {{ props.title ? props.title : $t("ui.detailed") }}
  </UiTypography>
</template>

<style lang="scss" module>
.body {
  display: inline-block;
  margin-top: 10px;
  font-size: var(--fs-span);
}
</style>
