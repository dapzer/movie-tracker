import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { useGetUserProfileApi } from "~/api/user/useUserApi"

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useGetUserProfileApi()
  if (!user.isFetched.value) {
    await user.suspense()
  }

  if (!user.data.value) {
    return navigateTo("/sign-in", { redirectCode: 401 })
  }

  if (to.meta.requiredRoles) {
    const hasRequiredRole = to.meta.requiredRoles.some(role => user.data?.value?.roles.includes(role))

    if (!hasRequiredRole) {
      return navigateTo("/", { redirectCode: 403 })
    }

    return true
  }

  return true
})
