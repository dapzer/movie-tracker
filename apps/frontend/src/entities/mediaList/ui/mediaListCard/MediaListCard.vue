<script setup lang="ts">

import { UiListCard } from "~/shared/ui/UiCard/listCard"
import type { MediaListType } from "@movie-tracker/types"
import { computed } from "vue"
import { getProxiedImageUrl, useI18n } from "#imports"
import { useClipboard } from "@vueuse/core"
import { useLocalePath } from "#i18n"
import { UiTypography } from "../../../../shared/ui/UiTypography"
import { UiButton } from "../../../../shared/ui/UiButton"
import { NuxtLink } from "#components"
import { UiIcon } from "../../../../shared/ui/UiIcon"
import { getElementDeclensionTranslationKey } from "~/utils/getElementDeclensionTranslationKey"

interface MediaListCardProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardProps>();
const { t, locale } = useI18n();
const { copy, copied } = useClipboard({ copiedDuring: 1000 });
const localePath = useLocalePath();

const title = computed(() => {
  return props.list.isSystem && !props.list.title ? t("mediaList.favorites") : props.list.title ?? "";
});

const copyLink = () => {
  copy(`${window.location.origin}/lists/details/${props.list.humanFriendlyId}`);
};

const listPageUrl = computed(() => localePath(`/lists/details/${props.list.humanFriendlyId}`));
const posters = computed(() => {
  return props.list.poster?.[locale.value].map(el => el ? getProxiedImageUrl(el, 179) : el)
})
</script>

<template>
  <UiListCard
    :width="560"
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
        v-if="props.list.isPublic"
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

    <div :class="$style.content">
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
            v-if="props.list.isPublic"
            name="icon:shared-planet"
            :width="16"
            :height="18"
          />
          <UiIcon
            v-else
            :width="16"
            :height="18"
            name="icon:locker"
          />
          {{ props.list.isPublic ? $t("ui.public") : $t("ui.private") }}
        </UiTypography>
      </div>
      <div>
        <UiTypography
          v-if="props.list.isPublic"
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
@import "~/styles/mixins";

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

.content {
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
