import crypto from "node:crypto"
import process from "node:process"

// Sentry is enabled only when a DSN is provided.
const isSentryEnabled = Boolean(process.env.NUXT_PUBLIC_SENTRY_DSN)

const apiOrigin = new URL(process.env.VITE_API_URL || "http://localhost:1337/api").origin

// Unhashed files from public/ — cached moderately, so replaced files propagate quickly.
const publicAssetFiles = [
  "authBackground.webp",
  "avatarPoster.svg",
  "avatar.svg",
  "communityListsHeroBackground.webp",
  "danilaVoronkov.webp",
  "defaultMoviePoster.svg",
  "favicon.ico",
  "heroBackground.png",
  "heroBackground.webp",
  "landingFaqMovies.webp",
  "landingListsPagePc.webp",
  "landingListsPage.webp",
  "landingMainPage.webp",
  "logo.jpg",
  "logo.png",
  "logo.svg",
  "melkam.jpeg",
  "ogImageEn.webp",
  "ogImageRu.webp",
]

const publicAssetRouteRules = Object.fromEntries(
  publicAssetFiles.map(file => [
    `/${file}`,
    { headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } },
  ]),
)

export default defineNuxtConfig({
  telemetry: false,

  app: {
    head: {
      title: "Movie Tracker",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "preconnect", href: apiOrigin, crossorigin: "" },
        { rel: "dns-prefetch", href: apiOrigin },
      ],
    },
  },

  features: {
    inlineStyles: true, // or a function to determine inlining
  },

  experimental: {
    emitRouteChunkError: "automatic-immediate",
    typescriptPlugin: true,
  },

  dxup: {
    features: {
      namedLayoutSlots: true,
    },
  },

  devtools: { enabled: true },

  modules: [
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "nuxt-schema-org",
    "@nuxt/fonts",
    "reka-ui/nuxt",
    "@nuxt/icon",
    "nuxt-umami",
    "@nuxtjs/mdc",
    "@nuxtjs/fontaine",
    ...(isSentryEnabled ? ["@sentry/nuxt/module"] : []),
    "nuxt-vitalizer",
  ],

  site: {
    url: process.env.VITE_BASE_URL || "http://localhost:3000",
    name: "Movie Tracker",
  },

  routeRules: {
    // Build assets are content-hashed by Vite — safe to cache forever.
    "/_nuxt/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    // Font files change rarely and are versioned by file name.
    "/fonts/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    ...publicAssetRouteRules,
  },

  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
      },
    },
  },

  sitemap: {
    exclude: ["/dashboard", "/release-subscriptions", "/lists", "/search"],
    cacheMaxAgeSeconds: 24 * 60 * 60,
    defaultSitemapsChunkSize: 50000,
    sitemaps: {
      index: [
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/tv/ru/sitemap-index.xml` },
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/tv/en/sitemap-index.xml` },
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/movie/ru/sitemap-index.xml` },
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/movie/en/sitemap-index.xml` },
        // { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/person/sitemap-index.xml` },
      ],
    },
  },

  schemaOrg: {
    defaults: false,
    // ident
  },

  i18n: {
    baseUrl: process.env.VITE_BASE_URL || "http://localhost:3000",
    restructureDir: "./app/",
    detectBrowserLanguage: false,
    defaultLocale: "ru",
    // experimental: {
    //   typedOptionsAndMessages: "all",
    // },
    locales: [
      {
        code: "en",
        iso: "en",
        language: "en",
        file: "en.ts",
      },
      {
        code: "ru",
        iso: "ru",
        language: "ru",
        file: "ru.ts",
      },
    ],
  },

  icon: {
    mode: "css",
    customCollections: [
      {
        prefix: "icon",
        dir: "./app/assets/svg/icons",
      },
      {
        prefix: "svg",
        dir: "./app/assets/svg/images",
      },
    ],
  },

  umami: {
    id: "43c97acf-6163-4049-bca2-df93a5122d9b",
    host: "https://umami.movie-tracker.app",
    autoTrack: true,
    // enabled: process.env.NODE_ENV !== "production",
  },

  mdc: {
    components: {
      prose: true,
    },
  },

  vitalizer: { disablePrefetchLinks: true, disablePreloadLinks: true, disableStylesheets: "entry" },

  components: {
    dirs: [{
      path: "shared/ui/UiMarkdown",
      global: true,
      extensions: ["vue"],
    }],
  },

  css: ["~/shared/styles/global.scss"],

  imports: {
    autoImport: false,
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },

  vite: {
    clearScreen: false,
    server: {
      proxy: {
        "/sitemaps": {
          target: process.env.VITE_API_URL,
          changeOrigin: false,
        },
      },
    },
    css: {
      devSourcemap: process.env.NODE_ENV !== "production",
      preprocessorMaxWorkers: true,
      modules: {
        generateScopedName: (name, filename, css) => {
          const hash = crypto.createHash("md5").update(css).digest("hex").substring(0, 5)
          const componentName = filename.split("/").pop()?.split(".")[0]!.replace(/[^a-z ]/gi, "") ?? ""

          return `${componentName}_${name}_${hash}`
        },
      },
    },
    optimizeDeps: {
      include: [
        "@tanstack/vue-query",
        "@unhead/schema-org/vue",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "embla-carousel-vue",
        "vaul-vue",
        "vue3-toastify",
        "yup",
      ],
    },
  },

  compatibilityDate: "2025-01-19",

  ...(isSentryEnabled
    ? {
        sentry: {
          sourceMapsUploadOptions: {
            org: "movietracker",
            project: "frontend",
            telemetry: false,
          },
        },
      }
    : {}),

  sourcemap: {
    client: "hidden",
  },
})
