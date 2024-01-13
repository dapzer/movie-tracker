<script lang="ts" setup>
import type { MediaItemType, MediaDetailsType, MediaDetailsInfoType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed } from "vue";
import { getTmdbImageUrl, useI18n } from "#imports";
import { UiCard } from "~/components/ui/UiCard";
import { useLocalePath } from "#i18n";
import UiLinkToDetails from "~/components/ui/UiLinkToDetails.vue";

interface MediaItemCardProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemCardProps>();
const localePath = useLocalePath();
const { locale, t } = useI18n();

const currentMediaDetails = computed(() => {
  return props.mediaItem.mediaDetails?.[locale.value as keyof Pick<MediaDetailsType, "ru" | "en">];
});

const description = computed(() => {
  return `${t("mediaItem.addedDate")} ${new Date(props.mediaItem.createdAt).toLocaleDateString(locale.value)}`
})
</script>

<template>
  <UiCard
    :title="currentMediaDetails?.title || ''"
    :image="getTmdbImageUrl(currentMediaDetails?.poster || '')"
    :link="localePath(`/details/${mediaItem.mediaType}/${mediaItem.mediaId}`)"
    :description="description"
  >
    <UiLinkToDetails
      :media-id="mediaItem.mediaId"
      :media-type="mediaItem.mediaType"
    />
  </UiCard>
</template>

<style lang="scss" module></style>
