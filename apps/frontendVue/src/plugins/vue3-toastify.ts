import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, { autoClose: 1500, limit: 2, theme: "dark", position: "top-right" });

  return {
    provide: { toast }
  };
});
