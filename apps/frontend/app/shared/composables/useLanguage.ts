import { useI18n } from "#i18n"
import { LanguagesEnum } from "@movie-tracker/types"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useLocalStorage } from "@vueuse/core"
import { computed, watch } from "vue"
import { updateUserLanguageApi } from "~/api/users/usersApi"
import { useAuth } from "~/shared/composables/useAuth"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"

export function useLanguage() {
  const { profile, isAuthorized } = useAuth()
  const { locale, setLocale } = useI18n()
  const queryClient = useQueryClient()

  const localStorageLanguage = useLocalStorage<string | undefined>(LocalStorageEnum.LANGUAGE, undefined)

  const currentLanguage = computed((): string | undefined => {
    if (isAuthorized.value && profile.value?.language) {
      return profile.value.language
    }

    return localStorageLanguage.value || locale.value
  })

  const updateLanguageMutation = useMutation({
    mutationFn: (language: LanguagesEnum) => updateUserLanguageApi(language),
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data)
    },
  })

  const setLanguage = (newLanguage: LanguagesEnum) => {
    localStorageLanguage.value = newLanguage

    setLocale(newLanguage)

    if (isAuthorized.value) {
      updateLanguageMutation.mutate(newLanguage)
    }
  }

  watch(locale, (newLocale) => {
    if (newLocale !== currentLanguage.value) {
      const languageEnum = newLocale === "ru" ? LanguagesEnum.RU : LanguagesEnum.EN

      setLanguage(languageEnum)
    }
  })

  return {
    currentLanguage,
    setLanguage,
    updateLanguageMutation,
  }
}
