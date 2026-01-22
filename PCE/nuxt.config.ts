// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800&family=Roboto:wght@300;400;500;700&display=swap'
        }
      ]
    }
  }
})
