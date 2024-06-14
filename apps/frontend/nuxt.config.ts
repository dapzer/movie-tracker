import crypto from "crypto";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  app: {
    head: {
      title: "Movie Tracker",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      script: [
        (process.env.NODE_ENV === "production" ? {
          async: true,
          src: "https://umami.movie-tracker.app/script.js",
          "data-website-id": "43c97acf-6163-4049-bca2-df93a5122d9b"
        } : {})
      ]
    }
  },
  devtools: { enabled: true },
  modules: [
    "nuxt-svgo",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "nuxt-simple-robots",
    "nuxt-schema-org",
    "nuxt-delay-hydration",
    '@nuxt/fonts'
  ],
  site: {
    url: process.env.VITE_BASE_URL || "http://localhost:3000",
    name: "Movie Tracker",
  },
  sitemap: {
    exclude: ["/dashboard"],
    cacheMaxAgeSeconds: 24 * 60 * 60,
    defaultSitemapsChunkSize: 2000,
    sitemaps: {
      index: [
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/tv/sitemap-index.xml.gz` },
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/movie/sitemap-index.xml.gz` },
        { sitemap: `${process.env.VITE_BASE_URL}/sitemaps/details/person/sitemap-index.xml.gz` }
      ]
    }
  },
  i18n: {
    lazy: true,
    baseUrl: process.env.VITE_BASE_URL || "http://localhost:3000",
    langDir: "./locales",
    detectBrowserLanguage: false,
    defaultLocale: "ru",
    locales: [
      {
        code: "en",
        iso: "en",
        file: "en.ts"
      },
      {
        code: "ru",
        iso: "ru",
        file: "ru.ts"
      }
    ]
  },
  svgo: {
    svgo: true,
    defaultImport: "component",
    svgoConfig: {
      multipass: true
    }
  },
  delayHydration: {
    mode: 'init',
    debug: process.env.NODE_ENV !== "production"
  },
  css: ["@/styles/global.scss", "@/styles/variables.scss"],
  imports: {
    autoImport: false
  },
  components: {
    dirs: []
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  vite: {
    clearScreen: false,
    server: {
      proxy: {
        "/sitemaps": {
          target: process.env.VITE_API_URL,
          changeOrigin: false
        }
      }
    },
    css: {
      modules: {
        generateScopedName: (name, filename, css) => {
          const hash = crypto.createHash("md5").update(css).digest("hex").substring(0, 5);
          const componentName = filename.split("/").pop()?.split(".")[0].replace(/[^a-zA-Z ]/g, "") ?? "";

          return `${componentName}_${name}_${hash}`;
        }
      }
    }
  }
});
