import type { UserRoleEnum } from "@movie-tracker/types"
import type en from "./src/locales/en.ts"

type Lang = typeof en

/// <reference types="@histoire/plugin-vue/components" />

declare module "vue-i18n" {
  export interface DefineLocaleMessage extends Lang {
  }
}

declare module "*.svg" {
  import type { DefineComponent } from "vue"

  const component: DefineComponent
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "#app" {
  interface PageMeta {
    requiredRoles?: UserRoleEnum[]
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
