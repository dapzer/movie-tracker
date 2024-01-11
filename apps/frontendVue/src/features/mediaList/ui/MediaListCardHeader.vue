<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { useLocalePath } from "#i18n";
import type { MediaListType } from "@movie-tracker/types";
import { computed, ref } from "vue";
import { useI18n, watch } from "#imports";

interface MediaListCardHeaderProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardHeaderProps>();
const localePath = useLocalePath();
const isPosterLoaded = ref(true);
const { t } = useI18n();

watch(() => props.list.poster, () => {
  isPosterLoaded.value = true;
});

const title = computed(() => {
  let value = "";

  if (props.list.isSystem && !props.list.title) {
    value = t("mediaList.favorites");
  } else {
    value = props.list.title ?? t("mediaList.nameNotSet");
  }

  if (value.length > 12) {
    return `${value.slice(0, 12)}...`;
  }

  return value;
});
</script>

<template>
  <div :class="$style.wrapper">
    <NuxtLink :to="localePath(`/lists/${props.list.id}`)">
      <div :class="$style.imageWrapper">
        <NuxtImg
          v-if="props.list.poster && isPosterLoaded"
          :alt="props.list.title"
          :src="props.list.poster"
          @error="isPosterLoaded = false"
        />
      </div>

      <div :class="$style.overlay">
        <UiTypography
          variant="title2"
        >
          {{ title }}
        </UiTypography>
      </div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  height: 150px;
  position: relative;


  .overlay {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--s-border-radius);

    p {
      word-break: break-all;
      text-align: center;
    }
  }

  .imageWrapper {
    width: 100%;
    height: 100%;
    background-color: var(--c-primary);
    border-radius: var(--s-border-radius);

    img {
      object-fit: cover;
      border-radius: var(--s-border-radius);
    }
  }
}
</style>
