<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { serviceSocialList } from "~/features/serviceSocial/model/serviceSocialList";
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography variant="title3">
      {{ $t("hero.social.title") }}
    </UiTypography>

    <ul :class="$style.list">
      <li
        v-for="service in serviceSocialList"
        :key="service.url"
      >
        <UiTypography
          :href="service.url"
          as="a"
          target="_blank"
          variant="link"
        >
          {{ $t(service.label) }}
        </UiTypography>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    li {
      list-style: disc inside;
      color: var(--c-text);
    }
  }
}
</style>
