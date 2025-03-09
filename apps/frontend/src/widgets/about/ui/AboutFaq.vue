<script setup lang="ts">
import { useI18n } from "#imports"
import { computed, h } from "vue"
import { UiAccordion } from "~/shared/ui/UiAccordion"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiImage } from "~/shared/ui/UiImage"
import { UiMarkdown } from "~/shared/ui/UiMarkdown"
import { UiTypography } from "~/shared/ui/UiTypography"

const { t } = useI18n()

const createListContent = computed(() => {
  return h(UiMarkdown, { value: t("about.faq.questions.createList.description") })
})
const contactSupportContent = computed(() => {
  return h(UiMarkdown, { value: t("about.faq.questions.contactSupport.description") })
})

const accordionItems = computed(() => {
  return [
    {
      title: t("about.faq.questions.movieTracker.title"),
      content: t("about.faq.questions.movieTracker.description"),
      value: "movieTracker",
    },
    {
      title: t("about.faq.questions.createList.title"),
      as: UiMarkdown,
      asProps: { value: t("about.faq.questions.createList.description") },
      value: "createList",
      asNode: true,
    },
    {
      title: t("about.faq.questions.changeStatus.title"),
      content: t("about.faq.questions.changeStatus.description"),
      value: "changeStatus",
    },
    {
      title: t("about.faq.questions.leaveReview.title"),
      content: t("about.faq.questions.leaveReview.description"),
      value: "leaveReview",
    },
    {
      title: t("about.faq.questions.contactSupport.title"),
      as: UiMarkdown,
      asProps: { value: t("about.faq.questions.contactSupport.description") },
      value: "contactSupport",
      asNode: true,
    },
  ]
})
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <div :class="$style.movies">
      <UiImage
        src="landingFaqMovies.webp"
        :width="577"
        :height="621"
      />
    </div>
    <div :class="$style.content">
      <div :class="$style.header">
        <UiTypography
          variant="title2"
          as="h1"
        >
          {{ $t("about.faq.title") }}
        </UiTypography>
        <UiTypography
          variant="subheading"
          :class="$style.description"
        >
          {{ $t("about.faq.description") }}
        </UiTypography>
      </div>

      <UiAccordion
        :items="accordionItems"
      />
    </div>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  position: relative;
  margin-top: 96px;
  min-height: 662px;

  .movies {
    position: absolute;
    left: -246px;
    top: -47px;
    width: 577px;
    height: 621px;
    z-index: -1;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 27px;
    width: 230px;
    height: 224px;
    left: 0;
    z-index: -2;
    background: var(--c-button-background-primary);
    filter: blur(200px);
    transform: rotate(-16.2deg);
  }

  .content {
    margin-left: 36%;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .description {
    color: var(--c-description);
  }

  @include tabletDevice {
    margin-top: 80px;

    .content {
      margin-left: 48%;
    }
  }

  @include mobilePlusDevice {
    margin-top: 70px;
    min-height: unset;

    .movies {
      display: none;
    }

    .content {
      margin-left: 0;
    }

    &:after {
      bottom: -95px;
      width: 105px;
      height: 105px;
      filter: blur(100px);
    }
  }
}
</style>
