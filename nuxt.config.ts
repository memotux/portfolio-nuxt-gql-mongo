// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    seedDb: false,
  },
  modules: ["nuxt-mongoose", "@nuxt/ui"]
})