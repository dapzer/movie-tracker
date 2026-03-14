import { defineNuxtPlugin } from "#app"
import Vue3Toastify, { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 1500,
    limit: 2,
    theme: "dark",
    position: "top-right",
    toastClassName: "toast-wrapper",
    bodyClassName: "toast-body",
    progressClassName: "toast-progress-bar",
  })

  return {
    provide: { toast },
  }
})
