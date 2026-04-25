import { defineNuxtPlugin } from "#app"
import { useLocalStorage } from "@vueuse/core"
import { watch } from "vue"
import { useLanguage } from "~/shared/composables/useLanguage"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"

export default defineNuxtPlugin(() => {
  const { currentLanguage } = useLanguage()
  const localStorageLanguage = useLocalStorage<string | undefined>(LocalStorageEnum.LANGUAGE, undefined)

  watch(currentLanguage, (newLanguage) => {
    if (newLanguage) {
      localStorageLanguage.value = newLanguage
    }
  }, { immediate: true })
})
