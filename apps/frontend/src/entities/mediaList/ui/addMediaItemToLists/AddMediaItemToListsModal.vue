<script setup lang="ts">
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { UiModal } from "~/components/ui/UiModal"
import AddMediaItemToListsForm from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsForm.vue"
import { computed, useI18n } from "#imports"
import { useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { UiBottomDrawer } from "~/components/ui/UiBottomDrawer"
import { useIsMobile } from "~/composables/useIsMobile"

interface AddMediaItemToListsModalProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<AddMediaItemToListsModalProps>();
const model = defineModel<boolean>()
const { locale } = useI18n();
const { isMobile } = useIsMobile()

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries, model.value);
</script>

<template>
  <ClientOnly>
    <UiModal
      v-if="!isMobile"
      v-model="model"
      :title="$t('mediaList.addToListTitle', {title: tmdbGetMovieDetailsApi.data?.value?.title || tmdbGetMovieDetailsApi.data?.value?.name})"
      :max-width="495"
    >
      <template #content>
        <AddMediaItemToListsForm
          :media-id="props.mediaId"
          :media-type="props.mediaType"
          @on-after-save="model = false"
        >
          <template #action>
            <slot name="action" />
          </template>
        </AddMediaItemToListsForm>
      </template>
    </UiModal>
    <UiBottomDrawer
      v-else
      v-model="model"
      :title="$t('mediaList.addToListTitle', {title: tmdbGetMovieDetailsApi.data?.value?.title || tmdbGetMovieDetailsApi.data?.value?.name})"
    >
      <template #content>
        <AddMediaItemToListsForm
          :media-id="props.mediaId"
          :media-type="props.mediaType"
          @on-after-save="model = false"
        >
          <template #action>
            <slot name="action" />
          </template>
        </AddMediaItemToListsForm>
      </template>
    </UiBottomDrawer>
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
