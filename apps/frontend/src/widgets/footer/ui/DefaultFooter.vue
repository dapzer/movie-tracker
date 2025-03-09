<script lang="ts" setup>
import { useLocalePath } from "#i18n"
import { AppLogo } from "~/shared/ui/appLogo"
import { PublicResources } from "~/shared/ui/publicResources"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"
import { movieTrackerLinks } from "~/widgets/footer/model/movieTrackerLinks"
import DefaultFooterDataSource from "~/widgets/footer/ui/defaultFooter/DefaultFooterDataSource.vue"
import DefaultFooterLinkList from "~/widgets/footer/ui/defaultFooter/DefaultFooterLinkList.vue"

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
          <!-- TODO: show after implement pages -->
          <UiTypography
            v-if="false"
            variant="label"
            :class="$style.title"
          >
            Movie Tracker
          </UiTypography>

          <div
            v-if="false"
            :class="$style.links"
          >
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
@import "~/styles/variables";
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
        }

        .description {
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
