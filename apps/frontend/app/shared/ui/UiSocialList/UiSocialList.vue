<script setup lang="ts">
import type { SocialIdsType } from "~/shared/ui/UiSocialList/model/getSocialList"
import { NuxtLink } from "#components"
import { computed } from "vue"
import { getSocialList } from "~/shared/ui/UiSocialList/model/getSocialList"

interface UisSocialListProps {
  socialList: SocialIdsType
  size?: number
}

const props = withDefaults(defineProps<UisSocialListProps>(), {
  size: 28,
})

const serializedSocialList = computed(() => {
  return getSocialList(props.socialList)
})
</script>

<template>
  <div
    v-if="serializedSocialList.length"
    :class="$style.wrapper"
    :style="`--icon-size: ${props.size}px;`"
  >
    <NuxtLink
      v-for="(social) in serializedSocialList"
      :key="social.url"
      :to="social.url"
      target="_blank"
    >
      <component
        :is="social.icon"
        :class="$style.icon"
      />
    </NuxtLink>
  </div>
</template>

<style module lang="scss">
@layer ui, external;

@layer ui {
  .wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    .icon {
      --size: var(--icon-size) !important;
    }

    a {
      color: var(--c-description);

      &:hover {
        color: var(--c-label-lihk-hovered);
      }
    }
  }
}
</style>
