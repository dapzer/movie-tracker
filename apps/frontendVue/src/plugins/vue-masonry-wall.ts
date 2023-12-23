import MasonryWall from "@yeger/vue-masonry-wall";
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MasonryWall);
});
