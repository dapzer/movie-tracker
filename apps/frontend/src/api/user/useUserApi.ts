import { useMutation, useQuery } from '@tanstack/vue-query';
import { getUserProfileApi, updateUserProfileApi } from '~/api/user/userApi';
import { UserQueryKeys } from '~/api/user/userApiQueryKeys';
import { useRequestHeaders } from "#app"

export const useUserProfileApi = () => {
  const headers = useRequestHeaders(["cookie", "connect.sid"]);

  return useQuery({
    queryKey: [UserQueryKeys.PROFILE],
    queryFn: () => getUserProfileApi(headers),
    retry: false,
  })
};

export const useUpdateUserProfileApi = () => useMutation({
  mutationKey: [UserQueryKeys.UPDATE_PROFILE],
  mutationFn: updateUserProfileApi,
})
