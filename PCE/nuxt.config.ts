// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['@google/generative-ai']
  },
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
  },
  runtimeConfig: {
    // Private keys (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

    // Email Configuration
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'PCE Web',

    // Database Configuration
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || 'pce_user',
    dbPassword: process.env.DB_PASSWORD || 'pce_password',
    dbName: process.env.DB_NAME || 'pce_db',
    geminiApiKey: process.env.GEMINI_API_KEY || '',


    // Public keys (exposed to client)
    public: {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_51QcVxwEwVGPRPrSBVGPRPrSBVGPRPrSBVGPRPrSBVGPRPrSB'
    }
  }
})
