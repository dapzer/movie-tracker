<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaListAccessLevelEnum } from "@movie-tracker/types"
import { useClipboard } from "@vueuse/core"
import { computed } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface MediaListCardProps {
  list: MediaListType
}

const props = defineProps<MediaListCardProps>()
const { t, locale } = useI18n()
const { copy, copied } = useClipboard({ copiedDuring: 1000 })
const localePath = useLocalePath()

const title = computed(() => {
  return props.list.isSystem && !props.list.title ? t("mediaList.favorites") : props.list.title ?? ""
})

function copyLink() {
  copy(`${window.location.origin}/lists/details/${props.list.humanFriendlyId}`)
}

const listPageUrl = computed(() => localePath(`/lists/details/${props.list.humanFriendlyId}`))
const posters = computed(() => {
  return props.list.poster?.[locale.value].map(el => el ? getProxiedImageUrl(el, 179) : el)
})

const accessLevel = computed(() => {
  switch (props.list.accessLevel) {
    case MediaListAccessLevelEnum.PRIVATE:
      return t("mediaList.settingsForm.accessLevel.private")
    case MediaListAccessLevelEnum.URL:
      return t("mediaList.settingsForm.accessLevel.url")
    case MediaListAccessLevelEnum.PUBLIC:
      return t("mediaList.settingsForm.accessLevel.public")
    default:
      return ""
  }
})
</script>

<template>
  <UiListCard
    :width="560"
    :user="props.list.user"
    :link-url="listPageUrl"
    :images-src="posters"
  >
    <div :class="$style.header">
      <UiTypography
        :class="$style.title"
        :as="NuxtLink"
        :to="listPageUrl"
        variant="listTitle"
      >
        {{ title }}
      </UiTypography>
      <UiButton
        v-if="props.list.accessLevel !== MediaListAccessLevelEnum.PRIVATE"
        :class="$style.shareButton"
        variant="text"
        :disabled="copied"
        @click="copyLink"
      >
        <UiIcon
          name="icon:share"
          :size="20"
        />
      </UiButton>
    </div>

    <UiTypography
      v-if="props.list.description"
      :class="$style.description"
      variant="text"
    >
      {{ props.list.description }}
    </UiTypography>

    <div :class="$style.footer">
      <div>
        <UiTypography variant="description">
          {{ props.list?.mediaItemsCount }} {{
            $t(getElementDeclensionTranslationKey(props.list?.mediaItemsCount || 0))
          }}
        </UiTypography>
        <UiTypography
          :class="$style.state"
          variant="description"
        >
          <UiIcon
            v-if="props.list.accessLevel === MediaListAccessLevelEnum.PUBLIC"
            name="icon:shared-planet"
            :width="16"
            :height="18"
          />
          <UiIcon
            v-else-if="props.list.accessLevel === MediaListAccessLevelEnum.URL"
            name="icon:link"
            :width="14"
            :height="18"
          />
          <UiIcon
            v-else
            name="icon:locker"
            :width="16"
            :height="18"
          />
          {{ accessLevel }}
        </UiTypography>
      </div>

      <div>
        <UiTypography
          v-if="props.list.accessLevel !== MediaListAccessLevelEnum.PRIVATE"
          :class="$style.likes"
          variant="description"
        >
          <UiIcon name="icon:like" />
          {{ props.list.likesCount }}
        </UiTypography>
      </div>
    </div>
  </UiListCard>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    @include ellipsisText();
  }

  .shareButton {
    height: fit-content;
    color: var(--c-description);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--c-label-lihk-hovered);
    }
  }
}

.description {
  @include ellipsisText();
  color: var(--c-description);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  & > div {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 4px;
  }

  .state {
    display: flex;
    gap: 4px;
  }

  .likes {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--c-label-secondary);
  }
}
</style>
