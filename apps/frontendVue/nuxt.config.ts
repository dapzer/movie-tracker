import crypto from "crypto";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  app: {
    head: {
      title: "Movie Tracker",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1"
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_API_URL,
      TMDB_API_URL: process.env.NUXT_TMDB_API_URL,
      TMDB_API_KEY: process.env.NUXT_TMDB_API_KEY
    }
  },
  modules: [
    "nuxt-svgo",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-lazy-load",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "nuxt-simple-robots",
  ],
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000"
  },
  sitemap: {
    cacheMaxAgeSeconds: 24 * 60 * 60,
    defaultSitemapsChunkSize: 2000,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sitemaps: {
      index: [
        { sitemap: `${process.env.VITE_API_URL}/sitemaps/details/tv/sitemap-index.xml.gz` },
        { sitemap: `${process.env.VITE_API_URL}/sitemaps/details/movie/sitemap-index.xml.gz` },
        { sitemap: `${process.env.VITE_API_URL}/sitemaps/details/person/sitemap-index.xml.gz` },
      ]
    }
  },
  i18n: {
    lazy: true,
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    langDir: "./locales",
    defaultLocale: "ru",
    locales: [{ code: "ru", iso: "ru-RU" }, { code: "en", iso: "en-US" }].map((locale) => {
      const foldersWithLocale = ["navigation", "auth", "hero", "search", "ui", "details", "mediaList", "mediaItem", "toasts", "seo"];

      return {
        code: locale.code,
        files: foldersWithLocale.map((folder) => `${folder}/${locale.code}.ts`),
        iso: locale.iso
      };
    })
  },
  lazyLoad: {
    images: true,
    videos: true,
    audios: true,
    iframes: true,
    native: false,
    directiveOnly: false
  },
  svgo: {
    svgo: true,
    defaultImport: "component",
    svgoConfig: {
      multipass: true
    }
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
