// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  devtools: { enabled: true },
  modules: ["nuxt-svgo"],
  svgo: {
    svgo: true,
    defaultImport: "component",
    svgoConfig: {
      multipass: true,
    },
  },
  css: ["@/styles/global.scss"],
  imports: {
    autoImport: false,
  },
  components: {
    dirs: [],
  },
});
