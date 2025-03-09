import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import bookshop from '@bookshop/astro-bookshop';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import alpine from '@astrojs/alpinejs';
import playformInline from '@playform/inline';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import icon from 'astro-icon';
import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig({
  site: 'https://tiny-jackal.cloudvent.net/',
  integrations: [
    react(),
    tailwind(),
    bookshop(),
    alpine(),
    mdx(),
    favicons(),
    icon({
      // svgoOptions: {},
      include: {
        fa: ['*'],
        ph: ['*'],
        logos: ['*'],
        'circle-flags': ['us', 'pt']
      },
      iconDir: 'src/assets/icons'
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
        locales: {
          en: 'en-US', // The `defaultLocale` value must present in `locales` keys
          pt: 'pt-PT'
        }
      }
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,avif,webp}']
      },
      devOptions: {
        enabled: true
      }
    }),
    playformInline()
  ],
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
      SIRE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost'
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
  trailingSlash: 'never',
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: 'responsive'
  },
  experimental: {
    responsiveImages: true,
    svg: {
      mode: 'sprite'
    }
  },

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
