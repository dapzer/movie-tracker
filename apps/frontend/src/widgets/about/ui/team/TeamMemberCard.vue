<script setup lang="ts">

import { UiListCard } from "~/components/ui/UiCard/listCard"
import { UiTypography } from "~/components/ui/UiTypography"
import { type SocialIdsType } from "~/utils/getSocialList"
import { UiSocialList } from "~/components/ui/UiSocialList"

interface TeamMemberCardProps {
  name: string;
  userId?: string;
  position: string;
  avatar?: string;
  socials: SocialIdsType;
}

const props = defineProps<TeamMemberCardProps>();
</script>

<template>
  <UiListCard
    :class="$style.wrapper"
    :user-avatar-src="props.avatar"
    :user-name="props.name"
    :user-id="props.userId"
  >
    <UiTypography variant="listTitle">
      {{ props.position }}
    </UiTypography>
    <UiSocialList
      :class="$style.socials"
      :social-list="props.socials"
      :size="24"
    />
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
