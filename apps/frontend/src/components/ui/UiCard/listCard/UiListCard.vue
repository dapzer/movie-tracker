<script lang="ts" setup>

import { UiCardBase } from '~/components/ui/UiCard';
import { UiImage } from "~/components/ui/UiImage"
import { UiUserProfileLink } from "~/components/ui/UiUserProfileLink"
import { ref } from "vue"
import { watchEffect } from "#imports"

interface UiListCardProps {
  width?: number;
  linkUrl?: string;
  userId?: string;
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
    :link-url="props.linkUrl"
  >
    <template #image>
      <div :class="$style.images">
        <div
          v-for="number in 6"
          :key="number"
          :class="$style.imagesItem"
        >
          <UiImage
            v-if="imagesSrc?.[number - 1]"
            :src="imagesSrc[number - 1]"
            fallback-src="/defaultMoviePoster.svg"
            @error="handleImageLoadingError(number)"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div :class="$style.contentWrapper">
        <UiUserProfileLink
          v-if="props.userName && props.userUrl && props.userId"
          :class="$style.userProfileLink"
          :user-name="props.userName"
          :user-url="props.userUrl"
          :user-id="props.userId"
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
@import '~/styles/mixins';
@import '~/styles/variables';

.wrapper {
  padding: 16px;
  gap: 0;

  @include mobileDevice {
    padding: 10px;
  }

  .userProfileLink {
    margin-top: 10px;

    @include mobileDevice {
      margin-top: 8px;
    }
  }

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

    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 16px;

      @include mobileDevice {
        margin-top: 12px;
      }
    }
  }
}
</style>
