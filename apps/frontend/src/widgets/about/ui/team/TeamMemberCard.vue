<script setup lang="ts">
import type { SocialIdsType } from "~/shared/ui/UiSocialList/model/getSocialList"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useGetMediaListsByIdApi } from "~/api/mediaList/useMediaListApi"
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import { UiSocialList } from "~/shared/ui/UiSocialList"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface TeamMemberCardProps {
  name: string
  userId?: string
  position: string
  avatar?: string
  socials: SocialIdsType
  mediaListHumanFriendlyId: string
}

const props = defineProps<TeamMemberCardProps>()

const mediaListApi = useGetMediaListsByIdApi(props.mediaListHumanFriendlyId)
await mediaListApi.suspense()

const { locale } = useI18n()
const localePath = useLocalePath()

const listPageUrl = computed(() => localePath(`/lists/details/${props.mediaListHumanFriendlyId}`))
const posters = computed(() => {
  return mediaListApi.data?.value?.poster?.[locale.value].map(el => el ? getProxiedImageUrl(el, 179) : el)
})
</script>

<template>
  <UiListCard
    :class="$style.wrapper"
    :user-avatar-src="props.avatar"
    :user-name="props.name"
    :user-id="props.userId"
    :images-src="posters"
    :link-url="listPageUrl"
  >
    <template
      v-if="props.userId"
      #header
    >
      <UiUserProfileLink
        :user-name="props.name"
        :user-id="props.userId"
        :user-avatar-src="props.avatar"
      />
    </template>

    <template #content>
      <UiTypography
        :as="NuxtLink"
        :to="listPageUrl"
        variant="listTitle"
      >
        {{ props.position }}
      </UiTypography>
    </template>

    <template #footer>
      <UiSocialList
        :class="$style.socials"
        :social-list="props.socials"
        :size="24"
      />
    </template>
  </UiListCard>
</template>

<style module lang="scss">
.wrapper {
  max-width: unset;
}

.socials {
  margin-top: 6px;
}
</style>
