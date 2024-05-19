import { AuthQueryKeys } from '~/api/auth/authApiQueryKeys';
import { MediaListQueryKeys } from '~/api/mediaList/mediaListApiQueryKeys';
import { MediaItemQueryKeys } from '~/api/mediaItem/mediaItemApiQueryKeys';
import { useQueryClient } from '@tanstack/vue-query';

export const useHandleResetUserData = () => {
  const queryClient = useQueryClient();

  const handleResetUserStates = async () => {
    await queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.USER_PROFILE] });
    queryClient.removeQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] });
    queryClient.removeQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] });
  };

  return {
    handleResetUserStates
  }
}
