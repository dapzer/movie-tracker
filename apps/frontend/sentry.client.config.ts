import * as Sentry from "@sentry/nuxt"

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: "https://ac11250d629580687a07b7c30b784490@o4509383644086272.ingest.de.sentry.io/4509383661977680",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [Sentry.replayIntegration()],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
