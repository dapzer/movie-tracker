import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/vue-query';
import { getUserProfileApi, getUserProfileByIdApi, updateUserProfileApi } from '~/api/user/userApi';
import { UserQueryKeys } from '~/api/user/userApiQueryKeys';
import { useRequestHeaders } from "#app"
import type { Ref } from "vue"

export const useUserProfileApi = () => {

  return useQuery({
    queryKey: [UserQueryKeys.PROFILE],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie", "connect.sid"]);

      return  getUserProfileApi({ headers })
    },
    retry: false,
  })
};

export const useUserProfileByIdApi = (userId: Ref<string>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) => {
  return useQuery({
    queryKey: [UserQueryKeys.PROFILE_BY_ID],
    queryFn: () => getUserProfileByIdApi(userId.value),
    ...options,
  })
};

export const useUpdateUserProfileApi = () => useMutation({
  mutationKey: [UserQueryKeys.UPDATE_PROFILE],
  mutationFn: updateUserProfileApi,
})
