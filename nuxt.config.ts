export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: false },
  modules: ["nuxt-quasar-ui", "@vite-pwa/nuxt"],
  css: ["~/assets/css/tokens.css"],

  quasar: {
    plugins: ["Notify", "Dialog"],
    config: { dark: true },
  },

  app: {
    head: {
      htmlAttrs: { lang: "pt-BR" },
      title: "Apply",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#0F120D", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#F6F7F3", media: "(prefers-color-scheme: light)" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "Apply" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png", sizes: "180x180" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-375x667-escuro.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-375x667-claro.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-390x844-escuro.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-390x844-claro.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-393x852-escuro.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-393x852-claro.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-402x874-escuro.png", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-402x874-claro.png", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-428x926-escuro.png", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-428x926-claro.png", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-430x932-escuro.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-430x932-claro.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-440x956-escuro.png", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
        { rel: "apple-touch-startup-image", href: "/splash/splash-440x956-claro.png", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Spline+Sans+Mono:wght@400;500;600&display=swap",
        },
      ],
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Apply — painel de operação",
      short_name: "Apply",
      description: "Busca, triagem e candidatura a vagas.",
      lang: "pt-BR",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#0F120D",
      theme_color: "#0F120D",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: "/icons/icon-escuro-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "fontes-google",
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: { installPrompt: true },
    devOptions: { enabled: false, type: "module" },
  },
});
