<script setup lang="ts">
import { useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { type MediaListType, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiCheckbox } from "~/components/newUi/UiCheckbox"
import { LockerIcon, SharedPlanetIcon } from "~/components/ui/icons"
import { getElementDeclensionTranslationKey } from "~/utils/getElementDeclensionTranslationKey"

interface AddMediaItemToListsFormItemProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
  mediaList: MediaListType;
}

const props = defineProps<AddMediaItemToListsFormItemProps>();
const model = defineModel<boolean>()

const getMediaItemsApi = useGetMediaItemsApi();

const titlesInListCount = computed(() => {
  return getMediaItemsApi.data.value?.filter(item => {
    return item.mediaListId === props.mediaList.id
  }).length || 0
})

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <label :class="$style.wrapper">
    <div>
      <UiCheckbox
        v-bind="$attrs"
        v-model="model"
      />
      <UiTypography variant="label">
        {{ props.mediaList.title ?? $t("mediaList.favorites") }}
      </UiTypography>
    </div>
    <div :class="$style.state">
      <UiTypography variant="description">
        {{ titlesInListCount }} {{ $t(getElementDeclensionTranslationKey(titlesInListCount)) }}
      </UiTypography>
      <SharedPlanetIcon v-if="props.mediaList.isPublic" />
      <LockerIcon v-else />
    </div>
  </label>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  gap: 16px;
  min-width: 0;
  border-radius: var(--s-border-radius-medium);
  outline: none;

  p {
    @include ellipsisText();
  }

  &:active,
  &:focus,
  &:has(input:focus),
  &:has(input:active),
  &:hover {
    background-color: var(--c-white-05);
    cursor: pointer;
  }

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }

  .state svg {
    width: 20px;
  }
}
</style>
