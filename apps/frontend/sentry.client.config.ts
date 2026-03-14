import { useRuntimeConfig } from "#imports"
import * as Sentry from "@sentry/nuxt"

Sentry.init({
  dsn: useRuntimeConfig().public.sentry.dsn,

  tracesSampleRate: 1.0,

  replaysSessionSampleRate: 0.3,

  replaysOnErrorSampleRate: 1.0,

  integrations: [],

  debug: false,
})

import("@sentry/nuxt").then((lazyLoadedSentry) => {
  Sentry.addIntegration(lazyLoadedSentry.replayIntegration())
})
