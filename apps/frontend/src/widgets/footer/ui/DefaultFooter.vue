<script lang="ts" setup>

import { UiContainer } from "~/components/newUi/UiContainer";
import { AppLogo } from "~/shared/ui/appLogo"
import { UiTypography } from "~/components/newUi/UiTypography"
import { PublicResources } from "~/shared/ui/publicResources"
import { movieTrackerLinks } from "~/widgets/footer/model/movieTrackerLinks"
import { useLocalePath } from "#i18n"
import DefaultFooterLinkList from "~/widgets/footer/ui/defaultFooter/DefaultFooterLinkList.vue"
import DefaultFooterDataSource from "~/widgets/footer/ui/defaultFooter/DefaultFooterDataSource.vue"

const localePath = useLocalePath()
</script>

<template>
  <footer :class="$style.wrapper">
    <UiContainer :class="$style.body">
      <div :class="$style.navigation">
        <div :class="$style.navigationItem">
          <AppLogo />
          <UiTypography
            :class="$style.description"
            variant="description"
          >
            {{ $t('footer.description') }}
          </UiTypography>
        </div>
        <div :class="$style.navigationItem">
          <UiTypography
            variant="label"
            :class="$style.title"
          >
            Movie Tracker
          </UiTypography>

          <div :class="$style.links">
            <DefaultFooterLinkList :links="movieTrackerLinks" />
          </div>
        </div>
        <div :class="$style.navigationItem">
          <PublicResources />
        </div>
      </div>

      <div :class="$style.about">
        <UiTypography variant="description">
          {{ $t('footer.copyright') }}
        </UiTypography>
        <DefaultFooterDataSource />
      </div>
    </UiContainer>
  </footer>
</template>

<style lang="scss" module>
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  width: 100%;
  background: var(--c-header-footer-background);
  border-top: 1px solid var(--c-stroke);
  padding: 30px 0;

  .body {
    display: flex;
    flex-direction: column;
    gap: 32px;

    .navigation {
      display: flex;
      gap: 32px 72px;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;

      @include mobileDevice() {
        flex-direction: column;
      }

      .navigationItem {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &:first-of-type {
          gap: 16px;
        }

        .title {
          font-size: var(--fs-label-small);
        }

        .description {
          font-size: var(--fs-label-small);
          white-space: pre-wrap;
        }
      }
    }

    .about {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

  }
}

</style>
