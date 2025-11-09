<script setup lang="ts">
import type { UserFollowType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useUserFollow } from "~/entities/userFollow/model/useUserFollow"
import { useAuth } from "~/shared/composables/useAuth"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTable, UiTableBody, UiTableCell, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"
import { getDeclensionTranslationKey } from "~/shared/utils/getDeclensionTranslationKey"
import { getTimeSinceDate } from "~/shared/utils/getTimeSinceDate"

interface UserFollowsTableProps {
  data?: UserFollowType[]
}

const props = defineProps<UserFollowsTableProps>()

const localePath = useLocalePath()
const { profile } = useAuth()
const { handleFollow, isPending } = useUserFollow()
const { locale } = useI18n()
</script>

<template>
  <UiTable>
    <UiTableHeader>
      <UiTableRow>
        <UiTableHead>{{ $t("userFollow.table.user") }}</UiTableHead>
        <UiTableHead>{{ $t("userFollow.table.following") }}</UiTableHead>
        <UiTableHead>{{ $t("userFollow.table.userFollowers") }}</UiTableHead>
        <UiTableHead :width="170">
          <!-- Action empty column -->
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>
    <UiTableBody>
      <UiTableRow
        v-for="follow in props.data"
        :key="follow.id"
      >
        <UiTableCell>
          <UiUserProfileLink
            :user-id="follow.followerUserProfile!.id"
            :user-name="follow.followerUserProfile!.name"
            :user-page-url="localePath(`/profile/${follow.followerUserProfile!.id}`)"
          />
        </UiTableCell>
        <UiTableCell>
          {{ getTimeSinceDate(follow.createdAt, locale) }}
        </UiTableCell>
        <UiTableCell>
          {{ follow.followerUserProfile!.followersCount }} {{
            $t(`ui.followers.${getDeclensionTranslationKey(follow.followerUserProfile!.followersCount)}`).toLowerCase()
          }}
        </UiTableCell>
        <UiTableCell
          align="right"
        >
          <UiButton
            v-if="follow.followerUserProfile!.id !== profile?.id"
            size="medium"
            :scheme="follow.followerUserProfile?.isFollowing ? 'gray' : 'primary'"
            :disabled="isPending"
            @click="handleFollow({
              userId: follow.followerUserProfile!.id,
              isFollowing: follow.followerUserProfile!.isFollowing,
            })"
          >
            {{ follow.followerUserProfile!.isFollowing ? $t("ui.unfollow") : $t("ui.follow") }}
          </UiButton>
        </UiTableCell>
      </UiTableRow>
    </UiTableBody>
  </UiTable>
</template>

<style module lang="scss">
</style>
