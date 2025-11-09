<script setup lang="ts">
import type { UserFollowType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import UserFollowButton from "~/entities/userFollow/ui/UserFollowButton.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { getDeclensionTranslationKey } from "~/shared/utils/getDeclensionTranslationKey"
import { getTimeSinceDate } from "~/shared/utils/getTimeSinceDate"

interface UserFollowsTableRowProps {
  follow: UserFollowType
}

const props = defineProps<UserFollowsTableRowProps>()

const localePath = useLocalePath()
const { profile } = useAuth()
const { locale } = useI18n()

const followUserProfile = computed(() => {
  return props.follow.followerUserProfile || props.follow.followingUserProfile
})
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <UiUserProfileLink
        :user-id="followUserProfile!.id"
        :user-name="followUserProfile!.name"
        :user-page-url="localePath(`/profile/${followUserProfile!.id}`)"
      />
    </UiTableCell>
    <UiTableCell>
      {{ getTimeSinceDate(props.follow.createdAt, locale) }}
    </UiTableCell>
    <UiTableCell>
      {{ followUserProfile!.followersCount }} {{
        $t(`ui.followers.${getDeclensionTranslationKey(followUserProfile!.followersCount)}`).toLowerCase()
      }}
    </UiTableCell>
    <UiTableCell
      align="right"
    >
      <UserFollowButton
        v-if="followUserProfile!.id !== profile?.id"
        :user-id="followUserProfile!.id"
        :is-following="followUserProfile!.isFollowing"
      />
    </UiTableCell>
  </UiTableRow>
</template>

<style scoped lang="scss">

</style>
