import { useLocalePath } from "#i18n"
import { useLocalStorage } from "@vueuse/core"
import { useRoute } from "#app"
import { useRouter } from "vue-router"
import { LocalStorageEnum } from "~/types/localStorageEnum"

export const useNavigateToSignInPage = () => {
  const localePath = useLocalePath();
  const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, '');
  const route = useRoute();
  const router = useRouter()

  const navigateToSignInPage = () => {
    authRedirectUrl.value = route.path;
    router.push(localePath('sign-in'));
  }

  return {
    navigateToSignInPage
  }
}
