import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import bookshop from '@bookshop/astro-bookshop';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import alpine from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import icon from 'astro-icon';
import favicons from 'astro-favicons';
// import sentry from '@sentry/astro';
// import spotlightjs from '@spotlightjs/astro';
// import astroMetaTags from 'astro-meta-tags';
// import { shield } from '@kindspells/astro-shield';
// import playformInline from '@playform/inline';
// import playformCompress from '@playform/compress';
// import min from 'astro-min';
// import webmanifest from 'astro-webmanifest';

// https://astro.build/config
export default defineConfig({
  site: 'https://topwalkingtoursportugal.com',
  integrations: [
    // sentry(),
    // spotlightjs(),
    // astroMetaTags(),
    react(),
    tailwind(),
    bookshop(),
    alpine(),
    favicons(),
    icon({
      // svgoOptions: {},
      // include: {
      //   fa: ['*'],
      //   ph: ['*'],
      //   logos: ['*'],
      //   'circle-flags': ['us', 'pt']
      // },
      iconDir: 'src/assets/icons'
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
        locales: {
          en: 'en', // The `defaultLocale` value must present in `locales` keys
          pt: 'pt'
        }
      }
    }),
    mdx(),
    // webmanifest({
    //   /**
    //    * required
    //    **/
    //   name: 'Top Walking Tours Portugal',

    //   /**
    //    * optional
    //    **/
    //   icon: 'src/assets/icons/logo_sq.svg', // source for favicon & icons
    //   short_name: 'TWTP',
    //   description: 'Top walking tours portugal',
    //   start_url: '/',
    //   theme_color: '#296a3f',
    //   background_color: '#fff',
    //   display: 'standalone'
    // }),
    AstroPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Top Walking Tours Portugal',
        short_name: 'Walking tours',
        theme_color: '#296a3f',
        background_color: '#fff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}']
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//]
      },
      experimental: {
        directoryAndTrailingSlashHandler: true
      }
    })
    // shield({}),
    // playformInline()
    // min()
    // playformCompress({
    //   CSS: true,
    //   HTML: false,
    //   Image: false,
    //   JavaScript: false,
    //   SVG: true,
    //   Logger: 0
    // })
  ],
  redirects: {
    '/hiking-alentejo-vicentine-southeast-portugal-coast/':
      '/tours/hiking-alentejo-vicentine-southeast-portugal-coast/',
    '/passeios-pedestres-portugal/': '/pt/passeios-pedestres-portugal/',
    '/hiking-douro-valley-wine-region':
      '/tours/hiking-douro-valley-wine-region/',
    '/hiking-algarve-vicentine-southeast-portugal-coast':
      '/tours/hiking-algarve-vicentine-southeast-portugal-coast/',
    '/hiking-alentejo-castles-wine-heritage':
      '/tours//hiking-alentejo-castles-wine-heritage/',
    '/hiking-atlantic-coast-porto': '/tours/hiking-atlantic-coast-porto/',
    '/hiking-coast-santiago-compostela-stage-2':
      '/tours//hiking-coast-santiago-compostela-stage-2/'
  },
  prefetch: {
    prefetchAll: true
  },
  env: {
    schema: {
      GOOGLE_SITE_VERIFICATION_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true
      }),
      GOOGLE_ANALYTICS_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true
      }),
      GOOGLE_PUBLIC_CAPTCHA: envField.string({
        context: 'client',
        access: 'public',
        optional: true
      }),
      SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://topwalkingtoursportugal.com'
      })
      // API_SECRET: envField.string({ context: "server", access: "secret" }),
    }
  },
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false
    }
  },
  trailingSlash: 'always',
  // image: {
  //   // Used for all Markdown images; not configurable per-image
  //   // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
  //   experimentalLayout: 'responsive'
  // },
  experimental: {
    // responsiveImages: true,
    svg: {
      mode: 'sprite'
    }
  },
  // redirects: {
  //   '/[...slug]': '/[...slug]/'
  // },
  vite: {
    // resolve: {
    //   alias: {
    //     '~': path.resolve('./src/') // Maps ~ to the src directory
    //   }
    // }
    //   css: {
    //     transformer: "lightningcss",
    //   },
    // plugins: [],
    build: {
      //   // inlineStylesheets: 'never',
      rollupOptions: {
        external: ['astro:content-layer-deferred-module']
      }
    }
  }
});
