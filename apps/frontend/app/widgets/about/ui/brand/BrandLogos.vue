<script setup lang="ts">
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"

const { t } = useI18n()

const files = computed<Array<{
  title: string
  fileName: string
  downloadLinks: Array<{
    title: string
    url: string
  }>
}>>(() => {
  return [
    {
      title: t("brand.logo"),
      fileName: "/logo.png",
      downloadLinks: [
        {
          title: "PNG",
          url: "/logo.png",
        },
        {
          title: "JPG",
          url: "/logo.jpg",
        },
        {
          title: "SVG",
          url: "/logo.svg",
        },
        {
          title: "PDF",
          url: "/logo.pdf",
        },
      ],
    },
  ]
})
</script>

<template>
  <div :class="$style.wrapper">
    <div
      v-for="file in files"
      :key="file.fileName"
      :class="$style.item"
    >
      <UiTypography
        :class="$style.title"
        variant="title3"
        as="h3"
      >
        {{ file.title }}
      </UiTypography>
      <UiImage
        :src="file.fileName"
      />
      <div
        :class="$style.links"
      >
        <template
          v-for="(link, index) in file.downloadLinks"
          :key="link.url"
        >
          <UiTypography
            schema="link"
            as="a"
            :href="link.url"
            target="_blank"
          >
            {{ link.title }}
          </UiTypography>
          <UiDelimiter v-if="index < file.downloadLinks.length - 1" />
        </template>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  .title {
    margin-bottom: 16px;
  }

  img {
    width: 150px;
    height: 150px;
  }

  .links {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
