import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useCreateUserFollowApi, useDeleteUserFollowApi } from "~/api/userFollow/useUserFollowApi"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"

export function useUserFollow() {
  const { t } = useI18n()

  const createUserFollowApi = useCreateUserFollowApi()
  const deleteUserFollowApi = useDeleteUserFollowApi()
  const { isAuthorized } = useAuth()
  const { navigateToSignInPage } = useNavigateToSignInPage()

  async function handleFollow(args: { isFollowing: boolean, userId: string }) {
    if (!isAuthorized.value) {
      navigateToSignInPage()
      return
    }

    if (args.isFollowing) {
      await deleteUserFollowApi.mutateAsync(args.userId).then(() => {
        toast.success(t("toasts.follow.successUnfollowed"))
      }).catch(() => {
        toast.error(t("toasts.follow.unsuccessfullyUnfollowed"))
      })
      return
    }

    await createUserFollowApi.mutateAsync(args.userId).then(() => {
      toast.success(t("toasts.follow.successFollowed"))
    }).catch(() => {
      toast.error(t("toasts.follow.unsuccessfullyFollowed"))
    })
  }

  const isPending = computed(() => {
    return createUserFollowApi.isPending.value || deleteUserFollowApi.isPending.value
  })

  return { isPending, handleFollow }
}
