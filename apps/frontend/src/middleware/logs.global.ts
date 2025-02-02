import { defineNuxtRouteMiddleware } from "#app"

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) return
  console.log(`Navigating from ${from.path} to ${to.path}`, new Date(Date.now()).toISOString())
})
