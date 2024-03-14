<script lang="ts" setup>

import UiContainer from "~/components/ui/UiContainer.vue";
import { socials } from "~/components/layout/defaultFooter/socials";
import UiTypography from "~/components/ui/UiTypography.vue";
</script>

<template>
  <footer :class="$style.wrapper">
    <UiContainer>
      <ul :class="$style.list">
        <UiTypography
          as="li"
          variant="listItem"
        >
          Created by:
          <UiTypography
            variant="listItemValue"
          >
            Danila Voronkov
          </UiTypography>
        </UiTypography>

        <UiTypography
          v-for="social in socials"
          :key="social.title"
          as="li"
          variant="listItem"
        >
          {{ social.title }}:
          <UiTypography
            :href="social.link"
            as="a"
            target="_blank"
            variant="link"
          >
            {{ social.value }}
          </UiTypography>
        </UiTypography>

        <UiTypography
          as="li"
          variant="listItem"
        >
          Film data from:
          <UiTypography
            :href="'https://www.themoviedb.org/'"
            as="a"
            target="_blank"
            variant="link"
          >
            TMDb
          </UiTypography>
        </UiTypography>
      </ul>
    </UiContainer>
  </footer>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  width: 100%;
  border-top: 1px solid var(--c-text);
  padding: 15px 0;
}

.list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 auto;
  width: fit-content;

  li {
    position: relative;

    &:not(:last-child):before {
      content: "";
      width: 3px;
      height: 3px;
      position: absolute;
      background: var(--c-secondary);
      top: 50%;
      border-radius: 50%;
      right: -13px;
    }
  }

  @media screen and (max-width: $bp-md) {
    flex-direction: column;
    margin: unset;

    li:before {
      display: none;
    }
  }
}
</style>
