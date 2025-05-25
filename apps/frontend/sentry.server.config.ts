import * as Sentry from "@sentry/nuxt"

Sentry.init({
  dsn: "https://ac11250d629580687a07b7c30b784490@o4509383644086272.ingest.de.sentry.io/4509383661977680",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
