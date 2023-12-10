declare module "*.svg" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    API_URL: string
    TMDB_API_URL: string
    TMDB_API_KEY: string
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
