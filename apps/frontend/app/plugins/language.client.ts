import type { LanguageValues } from "@movie-tracker/types"
import { defineNuxtPlugin } from "#app"
import { useRouter, useSwitchLocalePath } from "#imports"
import { useLocalStorage } from "@vueuse/core"
import { computed, watch } from "vue"
import { useAuth } from "~/shared/composables/useAuth"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"

interface I18nWithLocale {
  locale: {
    value: string
  }
  setLocale: (locale: LanguageValues) => Promise<void> | void
}

export default defineNuxtPlugin({
  name: "language",
  dependsOn: ["vue-query"],
  async setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as I18nWithLocale

    const router = useRouter()
    const switchLocalePath = useSwitchLocalePath()
    const { profile, isAuthorized } = useAuth()

    const locale = computed(() => i18n.locale.value)
    const localStorageLanguage = useLocalStorage<string | undefined>(LocalStorageEnum.LANGUAGE, undefined)

    const supportedLocales: LanguageValues[] = ["en", "ru"]

    const normalizeLanguage = (value?: string): LanguageValues | undefined => {
      if (!value) {
        return undefined
      }

      return supportedLocales.includes(value as LanguageValues) ? value as LanguageValues : undefined
    }

    const preferredLanguage = computed(() => {
      if (isAuthorized.value) {
        const profileLanguage = normalizeLanguage(profile.value?.language)

        if (profileLanguage) {
          return profileLanguage
        }
      }

      return normalizeLanguage(localStorageLanguage.value)
    })

    const applyLanguage = async (targetLanguage: LanguageValues) => {
      if (locale.value !== targetLanguage) {
        await i18n.setLocale(targetLanguage)
      }

      await router.isReady()

      const localizedPath = switchLocalePath(targetLanguage)

      if (localizedPath && localizedPath !== router.currentRoute.value.fullPath) {
        await router.replace(localizedPath)
      }
    }

    watch(preferredLanguage, async (newLanguage) => {
      if (!newLanguage) {
        return
      }

      await applyLanguage(newLanguage)
    }, { immediate: true })

    watch(locale, (newLanguage) => {
      if (newLanguage) {
        localStorageLanguage.value = newLanguage
      }
    }, { immediate: true })
  },
})
