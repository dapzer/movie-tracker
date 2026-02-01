import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#app"
import { useGetUserProfileApi } from "~/api/user/useUserApi"

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()

  const user = await nuxtApp.runWithContext(async () => {
    const getUserProfileApi = useGetUserProfileApi()
    return getUserProfileApi.suspense()
  })

  if (!user.data) {
    return navigateTo("/sign-in", { redirectCode: 401 })
  }

  if (to.meta.requiredRoles) {
    const hasRequiredRole = to.meta.requiredRoles.some(role => user.data?.roles.includes(role))

    if (!hasRequiredRole) {
      return navigateTo("/", { redirectCode: 403 })
    }

    return true
  }

  return true
})
