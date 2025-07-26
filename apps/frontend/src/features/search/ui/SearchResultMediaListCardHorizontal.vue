<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"

interface SearchResultMediaListCardHorizontalProps {
  list: MediaListType
}

const props = defineProps<SearchResultMediaListCardHorizontalProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        variant="label"
        ellipsis
      >
        {{ props.list.title || $t("mediaList.favorites") }}
      </UiTypography>
      <UiTag
        color="blue"
        variant="boxed"
      >
        {{ $t("details.mediaType.list") }}
      </UiTag>
    </div>
    <UiTypography
      v-if="props.list.description"
      :class="$style.description"
      variant="description"
    >
      {{ props.list.description }}
    </UiTypography>
    <div :class="$style.footer">
      <template v-if="props.list.user">
        <UiUserProfileLink
          :class="$style.userProfileLink"
          :user-id="props.list.user.id"
          :user-name="props.list.user.name"
          :user-avatar-src="props.list.user.image"
        />
        <UiDelimiter />
      </template>
      <UiTypography variant="description">
        {{ props.list?.mediaItemsCount }} {{
          $t(getElementDeclensionTranslationKey(props.list?.mediaItemsCount || 0))
        }}
      </UiTypography>
      <UiDelimiter />
      <UiTypography
        :class="[$style.likes, {
          [$style.liked]: props.list.isLiked,
        }]"
        variant="description"
      >
        {{ props.list.likesCount }}
        <UiIcon
          name="icon:like"
          :size="15"
        />
      </UiTypography>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.description {
  @include multiLineEllipsis(2);
}

.footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.likes {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--c-description);
}

.liked {
  color: var(--c-label-secondary);
}

.userProfileLink p {
  color: var(--c-text) !important;
}
</style>
