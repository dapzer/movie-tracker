import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useCreateUserFollowApi, useDeleteUserFollowApi } from "~/api/userFollow/useUserFollowApi"

export function useUserFollow() {
  const { t } = useI18n()

  const createUserFollowApi = useCreateUserFollowApi()
  const deleteUserFollowApi = useDeleteUserFollowApi()

  async function handleFollow(args: { isFollowing: boolean, userId: string }) {
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
