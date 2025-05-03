<script setup lang="ts">
import { Icon } from "#components"

export type UiIconName = "icon:close"
  | "icon:arrow"
  | "icon:edit"
  | "icon:search"
  | "icon:play"
  | "icon:list"
  | "icon:share"
  | "icon:settings"
  | "icon:trash"
  | "icon:eye"
  | "icon:arrow-right"
  | "icon:arrow-right-bold"
  | "icon:cross"
  | "icon:check"
  | "icon:card-arrow-top"
  | "icon:logo"
  | "icon:planet"
  | "icon:logout"
  | "icon:burger-menu"
  | "icon:discord"
  | "icon:telegram"
  | "icon:github"
  | "icon:tmdb-logo"
  | "icon:vkontakte"
  | "icon:yandex"
  | "icon:google"
  | "icon:github-provider"
  | "icon:star"
  | "icon:facebook"
  | "icon:instagram"
  | "icon:tiktok"
  | "icon:youtube"
  | "icon:twitter"
  | "icon:select-arrow"
  | "icon:clocks"
  | "icon:details"
  | "icon:back-arrow-small"
  | "icon:back-arrow-medium"
  | "icon:shared-planet"
  | "icon:locker"
  | "icon:plus"
  | "icon:like"
  | "icon:clone"
  | "icon:sort-arrow-down"
  | "icon:sort-arrow-up"
  | "icon:sort"
  | "icon:management"
  | "icon:pencil"
  | "icon:cross-fiilled"
  | "icon:discover-feature"
  | "icon:community-feature"
  | "icon:lists-feature"
  | "icon:status-feature"
  | "icon:tracking-feature"
  | "icon:review-feature"
  | "icon:round-open-in-new-tab"
  | "icon:double-arrow"
  | "icon:rating-star"
  | "icon:rating-star-filled"
  | "svg:landing-add-to-list"

interface UiIconProps {
  block?: boolean
  name: UiIconName
  width?: number
  height?: number
  size?: number
}

const props = defineProps<UiIconProps>()
</script>

<template>
  <Icon
    class="icon"
    :class="[$style.body, {
      [$style.block]: props.block,
    }]"
    :name="props.name"
    :style="{
      '--width': props.width ? `${props.width}px` : '1em',
      '--height': props.height ? `${props.height}px` : '1em',
      '--size': props.size ? `${props.size}px` : '1em',
    }"
  />
</template>

<style module lang="scss">
.body {
  width: var(--width);
  height: var(--height);
  font-size: var(--size);
}

.block {
  min-width: var(--width);
  min-height: var(--height);
}
</style>
