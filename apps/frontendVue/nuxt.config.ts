import crypto from "crypto";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_API_URL,
      TMDB_API_URL: process.env.NUXT_TMDB_API_URL,
      TMDB_API_KEY: process.env.NUXT_TMDB_API_KEY,
    },
  },
  modules: [
    "nuxt-svgo",
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],
  i18n: {
    lazy: true,
    langDir: './locales',
    defaultLocale: 'ru',
    locales: [
      { code: 'en', files: ['navigation/en.ts', 'auth/en.ts', 'hero/en.ts'] },
      { code: 'ru', files: ['navigation/ru.ts', 'auth/ru.ts', 'hero/ru.ts'] },
    ]
  },
  vue: {
    defineModel: true
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
