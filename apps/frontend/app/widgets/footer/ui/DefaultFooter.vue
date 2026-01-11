<script lang="ts" setup>
import { AppLogo } from "~/shared/ui/appLogo"
import { PublicResources } from "~/shared/ui/publicResources"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"
import { movieTrackerLinks } from "~/widgets/footer/model/movieTrackerLinks"
import DefaultFooterDataSource from "~/widgets/footer/ui/defaultFooter/DefaultFooterDataSource.vue"
import DefaultFooterLinkList from "~/widgets/footer/ui/defaultFooter/DefaultFooterLinkList.vue"

const currentYear = new Date().getFullYear()
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
          <UiTypography variant="label">
            Movie Tracker
          </UiTypography>

          <DefaultFooterLinkList :links="movieTrackerLinks" />
        </div>
        <div :class="$style.navigationItem">
          <PublicResources />
        </div>
      </div>

      <div :class="$style.about">
        <UiTypography
          variant="description"
          data-allow-mismatch
        >
          {{ $t('footer.copyright', { year: currentYear }) }}
        </UiTypography>
        <DefaultFooterDataSource />
      </div>
    </UiContainer>
  </footer>
</template>

<style lang="scss" module>
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

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
      gap: 32px 56px;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;

      @include tabletDevice() {
        flex-direction: column;
      }

      .navigationItem {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &:first-of-type {
          gap: 16px;
        }

        .description {
          white-space: pre-wrap;
          max-width: 480px;
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
