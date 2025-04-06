import { useRoute } from "#app"
import { useLocalePath } from "#i18n"
import { useLocalStorage } from "@vueuse/core"
import { useRouter } from "vue-router"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"

export function useNavigateToSignInPage() {
  const localePath = useLocalePath()
  const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, "")
  const route = useRoute()
  const router = useRouter()

  const navigateToSignInPage = () => {
    authRedirectUrl.value = route.path
    router.push(localePath("sign-in"))
  }

  return {
    navigateToSignInPage,
  }
}
