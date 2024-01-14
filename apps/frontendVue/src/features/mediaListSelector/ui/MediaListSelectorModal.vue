<script lang="ts" setup>
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types";
import { useGetMediaListsApi } from "~/composables/useMediaListApi";
import { UiModal } from "~/components/ui/UiModal";
import MediaListSelectorItem from "~/features/mediaListSelector/ui/MediaListSelectorItem.vue";
import type { UiModalProps } from "~/components/ui/UiModal/UiModal.vue";
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { SignInModal } from "~/features/signIn";
import UiLoadingIndicator from "~/components/ui/UiLoadingIndicator.vue";
import { ListIcon } from "~/components/ui/icons";

interface MediaListSelectorModalProps extends Omit<UiModalProps, "title"> {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MediaListSelectorModalProps>();

const { isLoading: isLoadingMediaLists, data: mediaLists } = useGetMediaListsApi();
const { isAuthorized, isLoadingProfile } = useAuth();

const isShowAuthModal = ref(false);
const isShowSelectModal = ref(false);

const handleMediaListSelectorModalOpen = () => {
  if (!isAuthorized.value) {
    isShowAuthModal.value = true;
  } else {
    isShowSelectModal.value = !isShowSelectModal.value;
  }
};

</script>

<template>
  <UiModal
    :is-loading="isLoadingMediaLists || isLoadingProfile"
    :class="$style.button"
    :button-color-scheme="props.buttonColorScheme"
    :button-size="props.buttonSize"
    :button-variant="props.buttonVariant"
    :external-opened-state="isShowSelectModal"
    :max-width="500"
    :title="$t('mediaList.addToList')"
    @additional-handler="handleMediaListSelectorModalOpen"
  >
    <template #trigger>
      <ListIcon v-if="!isLoadingMediaLists && !isLoadingProfile" />
      {{ $t("mediaList.addToList") }}
    </template>

    <template #content>
      <div
        v-if="mediaLists"
        :class="$style.list"
      >
        <MediaListSelectorItem
          v-for="mediaList in mediaLists"
          :key="mediaList.id"
          :media-id="props.mediaId"
          :media-list="mediaList"
          :media-type="MediaTypeEnum[props.mediaType.toUpperCase() as keyof typeof MediaTypeEnum]"
        />
      </div>
    </template>
  </UiModal>


  <SignInModal
    v-if="isShowAuthModal"
    :external-opened-state="isShowAuthModal"
    is-hide-trigger
    @additional-handler="isShowAuthModal = false"
  />
</template>

<style lang="scss" module>
.button {
  background: var(--c-accent) !important;
  border-radius: var(--s-border-radius);

  svg {
    width: 1em;
    height: 1em;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;

}
</style>
