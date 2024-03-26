<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { NuxtLink } from "#components";
import UiButton from "~/components/ui/UiButton.vue";
import { AddIcon, CheckMarkIcon, CloseIcon, EditIcon } from "~/components/ui/icons";
import UiTypography from "~/components/ui/UiTypography.vue";
import { computed, ref } from "vue";
import UiInput from "~/components/ui/UiInput.vue";
import { useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi";
import { isOnlySpaces } from "@movie-tracker/utils";
import { useI18n } from "#imports";
import { toast } from "vue3-toastify";

interface TrackingMenuSitesToViewProps {
  mediaItem: MediaItemType;
}

const props = defineProps<TrackingMenuSitesToViewProps>();
const { t } = useI18n();

const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi();

const currentEditItemIndex = ref<number | null>(null);
const currentEditItemUrl = ref<string | null>(null);

const sitesToView = computed(() => {
  return props.mediaItem.trackingData?.sitesToView || [];
});

const isDisableActiveSaveButton = computed(() => {
  return isOnlySpaces(currentEditItemUrl.value || "") && currentEditItemIndex.value ===
    props.mediaItem.trackingData?.sitesToView.length;
});

const handleEditItem = (index: number | null, url: string | null) => {
  currentEditItemIndex.value = index;
  currentEditItemUrl.value = url;
};

const handleSave = async () => {
  if (currentEditItemIndex.value === null) return;
  let finalArray = sitesToView.value.slice();

  if (currentEditItemIndex.value === sitesToView.value.length || !sitesToView.value.length) {
    finalArray.push({
      url: currentEditItemUrl.value || ""
    });
  } else if (!currentEditItemUrl.value) {
    finalArray.splice(currentEditItemIndex.value, 1);
  } else {
    finalArray[currentEditItemIndex.value] = {
      url: currentEditItemUrl.value
    };
  }

  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      sitesToView: finalArray
    }
  }).then(() => {
    toast.success(t("toasts.mediaItem.successSiteToViewChanged"));
  });

  handleEditItem(null, null);
};
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.items">
      <template
        v-for="(site, index) in sitesToView"
        :key="index"
      >
        <div
          v-if="currentEditItemIndex !== index"
          :class="$style.item"
          :style="{ '--order': index + 1 }"
        >
          <UiTypography
            :as="NuxtLink"
            :to="site.url"
            variant="link"
            target="_blank"
          >
            {{ $t(`mediaItem.trackingMenu.siteToView`) }} #{{ index + 1 }}
          </UiTypography>

          <UiButton
            :disabled="updateMediaItemTrackingDataApi.isPending.value"
            variant="clear"
            @click="handleEditItem(index, site.url)"
          >
            <EditIcon />
          </UiButton>
        </div>
      </template>

      <UiButton
        v-if="currentEditItemIndex === null"
        :disabled="sitesToView.length >= 3"
        :class="$style.item"
        :style="{ '--order': sitesToView.length || 1 }"
        variant="clear"
        @click="handleEditItem(sitesToView.length || 1, '')"
      >
        <UiTypography
          as="span"
          variant="textSmall"
        >
          {{ $t(`mediaItem.trackingMenu.addSiteToView`) }}
        </UiTypography>

        <AddIcon />
      </UiButton>

      <div
        v-if="currentEditItemIndex !== null"
        :class="[$style.item, $style.editing]"
        :style="{ '--order': currentEditItemIndex }"
      >
        <UiInput
          v-model="currentEditItemUrl"
          :disabled="updateMediaItemTrackingDataApi.isPending.value"
          variant="underlined"
        />

        <UiButton
          :disabled="updateMediaItemTrackingDataApi.isPending.value || isDisableActiveSaveButton"
          color-scheme="success"
          @click="handleSave"
        >
          <CheckMarkIcon />
        </UiButton>

        <UiButton
          :disabled="updateMediaItemTrackingDataApi.isPending.value"
          color-scheme="danger"
          @click="handleEditItem(null, null)"
        >
          <CloseIcon />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  .items {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .item {
      display: flex;
      justify-content: space-between;
      order: var(--order, 1);
      font-size: var(--fs-small-p);
      gap: 6px;

      span {
        color: inherit;
        font-weight: var(--fw-regular);
      }

      a {
        font-size: var(--fs-small-p);
      }

      button {
        font-size: var(--fs-small-p);
        transform: scaleX(-1);
      }

      svg {
        width: 1em;
        height: 1em;
      }
    }

    .editing {
      align-items: flex-end;

      button {
        height: 30px;
        padding: 6px 12px;
        border-radius: var(--s-border-radius);
        transform: none;

        svg {
          width: 14px;
          height: 14px;
        }

        &:first-of-type {
          svg {
            width: 18px;
            height: unset;
          }
        }
      }
    }
  }
}
</style>
