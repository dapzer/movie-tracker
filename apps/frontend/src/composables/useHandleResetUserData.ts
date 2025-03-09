import { useQueryClient } from "@tanstack/vue-query"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"

export function useHandleResetUserData() {
  const queryClient = useQueryClient()

  const handleResetUserStates = async () => {
    await queryClient.invalidateQueries({ queryKey: [UserQueryKeys.PROFILE] })
    queryClient.removeQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] })
    queryClient.removeQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] })
  }

  return {
    handleResetUserStates,
  }
}
