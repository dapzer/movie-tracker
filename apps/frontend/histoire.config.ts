import { HstNuxt } from "@histoire/plugin-nuxt"
import { HstVue } from "@histoire/plugin-vue"
import { defineConfig } from "histoire"

export default defineConfig({
  plugins: [HstVue(), HstNuxt()],
  setupFile: "histoire.setup.ts",
  backgroundPresets: [
    {
      label: "Transparent",
      color: "transparent",
      contrastColor: "#333",
    },
    {
      label: "White",
      color: "#fff",
      contrastColor: "#333",
    },
    {
      label: "Light gray",
      color: "#aaa",
      contrastColor: "#eee",
    },
    {
      label: "Dark gray",
      color: "#333",
      contrastColor: "#ccc",
    },
    {
      label: "Black",
      color: "#000",
      contrastColor: "#fff",
    },
    {
      label: "Main",
      color: "#0D0D0D",
      contrastColor: "#0D0D0D",
    },
  ],
  tree: {
    groups: [
      {
        title: "Ui Kit",
        id: "ui-kit",
      },
      {
        title: "Widgets",
        id: "widgets",
      },
      {
        title: "Features",
        id: "features",
      },
      {
        title: "Entities",
        id: "entities",
      },
      {
        title: "Others",
        include: file => true,
      },
    ],
  },
})
