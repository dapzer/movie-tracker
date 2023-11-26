import crypto from "crypto";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./src",
  devtools: { enabled: true },
  modules: ["nuxt-svgo"],
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
  css: ["@/styles/global.scss"],
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
          const componentName = filename.split("/").pop()?.split(".")[0] ?? "";

          return `${componentName}_${name}_${hash}`;
        }
      }
    }
  }
});
