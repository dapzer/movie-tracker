import type { UserRoleEnum } from "@movie-tracker/types"
import { navigateTo } from "#app"
import { watch } from "vue"
import { useAuth } from "~/shared/composables/useAuth"

export function useProtectedRoute(requiredRoles?: UserRoleEnum[]) {
  const { profile } = useAuth()

  watch(profile, (newProfile) => {
    if (!newProfile) {
      navigateTo("/", { redirectCode: 401 })
    }

    if (newProfile && requiredRoles && !requiredRoles.some(role => newProfile.roles.includes(role))) {
      navigateTo("/", { redirectCode: 403 })
    }
  }, { immediate: true })
}
