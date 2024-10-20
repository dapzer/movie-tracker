<script setup lang="ts">
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { UiModal } from "~/components/newUi/UiModal"
import AddMediaItemToListsForm from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsForm.vue"
import { computed, useI18n } from "#imports"
import { useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"

interface AddMediaItemToListsModalProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<AddMediaItemToListsModalProps>();
const model = defineModel<boolean>()
const { locale, t } = useI18n();

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
</script>

<template>
  <UiModal
    v-model="model"
    :title="$t('mediaList.addToListTitle', {title: tmdbGetMovieDetailsApi.data?.value?.title || tmdbGetMovieDetailsApi.data?.value?.name})"
    :max-width="495"
  >
    <template #content>
      <AddMediaItemToListsForm
        :media-id="props.mediaId"
        :media-type="props.mediaType"
        @on-after-save="model = false"
      />
    </template>
  </UiModal>
</template>

<style scoped lang="scss">

</style>
