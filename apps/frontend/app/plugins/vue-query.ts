import type { DehydratedState, VueQueryPluginOptions } from "@tanstack/vue-query"
// Nuxt 3 app aliases
import { defineNuxtPlugin, useState } from "#app"
import { dehydrate, hydrate, QueryClient, VueQueryPlugin } from "@tanstack/vue-query"

// Modify your Vue Query global settings here
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000, refetchOnMount: false } },
})

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query")

  const options: VueQueryPluginOptions = { queryClient, enableDevtoolsV6Plugin: true }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
