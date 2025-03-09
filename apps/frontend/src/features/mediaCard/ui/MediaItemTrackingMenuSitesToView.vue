<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useI18n } from "#imports"
import { isOnlySpaces } from "@movie-tracker/utils"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiTypography } from "~/shared/ui/UiTypography"

interface TrackingMenuSitesToViewProps {
  mediaItem: MediaItemType
}

const props = defineProps<TrackingMenuSitesToViewProps>()
const { t } = useI18n()

const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi()

const currentEditItemIndex = ref<number | null>(null)
const currentEditItemUrl = ref<string>("")

const sitesToView = computed(() => {
  return props.mediaItem.trackingData?.sitesToView || []
})

const isDisableActiveSaveButton = computed(() => {
  return isOnlySpaces(currentEditItemUrl.value || "") && currentEditItemIndex.value
    === props.mediaItem.trackingData?.sitesToView.length
})

function handleEditItem(index: number | null, url: string) {
  currentEditItemIndex.value = index
  currentEditItemUrl.value = url
}

async function handleDeleteItem(index: number) {
  const finalArray = sitesToView.value.slice()
  finalArray.splice(index, 1)

  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      sitesToView: finalArray,
    },
  }).then(() => {
    toast.success(t("toasts.mediaItem.successSiteToViewChanged"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullySiteToViewChanged"))
  })
}

async function handleSave() {
  if (currentEditItemIndex.value === null)
    return
  const finalArray = sitesToView.value.slice()

  if (currentEditItemIndex.value === sitesToView.value.length || !sitesToView.value.length) {
    finalArray.push({
      url: currentEditItemUrl.value || "",
    })
  }
  else if (!currentEditItemUrl.value) {
    finalArray.splice(currentEditItemIndex.value, 1)
  }
  else {
    finalArray[currentEditItemIndex.value] = {
      url: currentEditItemUrl.value,
    }
  }

  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      sitesToView: finalArray,
    },
  }).then(() => {
    toast.success(t("toasts.mediaItem.successSiteToViewChanged"))
  })

  handleEditItem(null, "")
}
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
            schema="link"
            target="_blank"
          >
            {{ $t(`mediaItem.trackingMenu.siteToView`) }} #{{ index + 1 }}
          </UiTypography>
          <div :class="$style.actions">
            <UiButton
              :disabled="updateMediaItemTrackingDataApi.isPending.value"
              variant="text"
              @click="handleEditItem(index, site.url || '')"
            >
              <UiIcon name="icon:pencil" />
            </UiButton>

            <UiButton
              :disabled="updateMediaItemTrackingDataApi.isPending.value"
              variant="text"
              scheme="tertiary"
              @click="handleDeleteItem(index)"
            >
              <UiIcon
                name="icon:trash"
                :size="19"
              />
            </UiButton>
          </div>
        </div>
      </template>

      <UiButton
        v-if="currentEditItemIndex === null"
        with-icon
        :disabled="sitesToView.length >= 3"
        :class="$style.addNew"
        :style="{ '--order': sitesToView.length || 1 }"
        variant="outlined"
        @click="handleEditItem(sitesToView.length || 1, '')"
      >
        {{ $t(`mediaItem.trackingMenu.addSiteToView`) }}
        <UiIcon name="icon:plus" />
      </UiButton>

      <div
        v-if="currentEditItemIndex !== null"
        :class="[$style.item, $style.editing]"
        :style="{ '--order': currentEditItemIndex }"
      >
        <UiInput
          v-model="currentEditItemUrl"
          size="small"
          :placeholder="$t(`mediaItem.trackingMenu.newSitePlaceholder`)"
          :disabled="updateMediaItemTrackingDataApi.isPending.value"
        />

        <UiButton
          :disabled="updateMediaItemTrackingDataApi.isPending.value || isDisableActiveSaveButton"
          scheme="secondary"
          @click="handleSave"
        >
          <UiIcon
            name="icon:check"
            :size="16"
          />
        </UiButton>

        <UiButton
          :disabled="updateMediaItemTrackingDataApi.isPending.value"
          scheme="tertiary"
          @click="handleEditItem(null, '')"
        >
          <UiIcon name="icon:cross-fiilled" />
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
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      order: var(--order, 1);
      gap: 6px;
      font-size: var(--fs-description);
      font-weight: var(--fw-regular);
      line-height: var(--lh-description);
      color: var(--c-text);

      & a {
        text-decoration: underline;
      }
    }

    .actions {
      display: flex;
      gap: 4px;

      button {
        height: 24px;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--s-border-radius-small);

        &:hover {
          background: var(--c-white-10);
        }
      }
    }

    .addNew {
      order: var(--order, 1);

      width: 100%;
    }

    .editing {
      align-items: flex-end;

      button,
      input {
        height: 32px;
      }

      button {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
