<script lang="ts" setup>

import { UiCardBase } from '~/components/newUi/UiCard';
import { UiImage } from "~/components/newUi/UiImage"
import { UiUserProfileLink } from "~/components/newUi/UiUserProfileLink"
import { ref } from "vue"
import { watchEffect } from "#imports"

interface UiListCardProps {
  width?: number;
  linkUrl?: string;
  userAvatarSrc?: string;
  userName?: string;
  userUrl?: string;
  imagesSrc?: string[];
}

const props = withDefaults(defineProps<UiListCardProps>(), {
  width: 396,
});

const imagesSrc = ref<string[] | undefined>(props.imagesSrc);

watchEffect(() => {
  imagesSrc.value = props.imagesSrc;
})

const handleImageLoadingError = (index: number) => {
  imagesSrc.value = imagesSrc.value?.splice(index, 1);
}
</script>

<template>
  <UiCardBase
    :class="$style.wrapper"
    :width="props.width"
    :linkUrl:="props.linkUrl"
  >
    <template #image>
      <div :class="$style.images">
        <div
          v-for="num in 6"
          :key="num"
          :class="$style.imagesItem"
        >
          <UiImage
            v-if="imagesSrc?.[num - 1]"
            :src="imagesSrc[num - 1]"
            @error="handleImageLoadingError(num)"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div :class="$style.contentWrapper">
        <UiUserProfileLink
          v-if="props.userName && props.userUrl"
          :user-name="props.userName"
          :user-url="props.userUrl"
          :user-avatar-src="props.userUrl"
        />

        <div :class="$style.content">
          <slot />
        </div>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
.wrapper {
  padding: 16px;
  gap: 12px;

  .images {
    width: 100%;
    display: flex;
    overflow: hidden;
    border-radius: var(--s-border-radius);

    .imagesItem {
      background: linear-gradient(337.92deg, #151515 3.25%, #1E1E1E 52.25%, #151515 100%);
      box-shadow: 4px 0px 20px rgba(13, 13, 13, 0.56);

      &:not(:first-child) {
        margin-left: -35px;
      }

      @for $i from 1 through 6 {
        &:nth-child(#{$i}) {
          z-index: 6 - $i;
        }
      }

      &,
      img {
        height: 100%;
        aspect-ratio: 2/ 3;
        width: 100%;
      }
    }
  }

  .contentWrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
}
</style>
