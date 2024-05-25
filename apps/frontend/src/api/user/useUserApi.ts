import { useMutation, useQuery } from '@tanstack/vue-query';
import { getUserProfileApi, updateUserProfileApi } from '~/api/user/userApi';
import { UserQueryKeys } from '~/api/user/userApiQueryKeys';

export const useUserProfileApi = () => useQuery({
  queryKey: [UserQueryKeys.PROFILE],
  queryFn: () => getUserProfileApi(),
  retry: false,
  refetchOnWindowFocus: false,
});

export const useUpdateUserProfileApi = () => useMutation({
  mutationKey: [UserQueryKeys.UPDATE_PROFILE],
  mutationFn: updateUserProfileApi,
})
