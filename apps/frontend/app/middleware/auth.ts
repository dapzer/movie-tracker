import type { UserType } from "@movie-tracker/types"
import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from "#app"
import { useQueryClient } from "@tanstack/vue-query"
import { getUserProfileApi } from "~/api/user/userApi"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"

export default defineNuxtRouteMiddleware(async (to) => {
  const queryClient = useQueryClient()
  let user = queryClient.getQueryData<UserType | null>([UserQueryKeys.PROFILE])

  if (!user) {
    user = await queryClient.fetchQuery({
      queryKey: [UserQueryKeys.PROFILE],
      queryFn: async () => {
        const headers = useRequestHeaders(["cookie"])
        if (!headers.cookie?.includes("session") && import.meta.server) {
          throw new Error("No session cookie found")
        }
        return getUserProfileApi({ headers })
      },
    })
  }

  if (!user) {
    return navigateTo("/sign-in", { redirectCode: 401 })
  }

  if (to.meta.requiredRoles) {
    const hasRequiredRole = to.meta.requiredRoles.some(role => user?.roles.includes(role))

    if (!hasRequiredRole) {
      return navigateTo("/", { redirectCode: 403 })
    }

    return true
  }

  return true
})
