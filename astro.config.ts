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
import RouteData from './data/routing.json';
import type { RedirectConfig, ValidRedirectStatus } from 'astro';
import rehypeExternalLinks from 'rehype-external-links';
import partytown from '@astrojs/partytown';
// import sentry from '@sentry/astro';
// import spotlightjs from '@spotlightjs/astro';
// import astroMetaTags from 'astro-meta-tags';
// import { shield } from '@kindspells/astro-shield';
// import playformInline from '@playform/inline';
// import playformCompress from '@playform/compress';
// import min from 'astro-min';
// import webmanifest from 'astro-webmanifest';

function convertJson(inputJson: {
  routes: { from: string; destination: string; status: ValidRedirectStatus }[];
}): Record<string, RedirectConfig> {
  const result = new Map<string, RedirectConfig>();

  inputJson.routes.forEach((route) => {
    result.set(route.from, {
      destination: route.destination,
      status: route.status
    });
  });

  return Object.fromEntries(result);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://topbiketoursportugal.com',
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
    mdx({
      rehypePlugins: [rehypeExternalLinks]
    }),
    // webmanifest({
    //   /**
    //    * required
    //    **/
    //   name: 'Top Bike Tours Portugal',

    //   /**
    //    * optional
    //    **/
    //   icon: 'src/assets/icons/logo_sq.svg', // source for favicon & icons
    //   short_name: 'TWTP',
    //   description: 'Top Bike Tours Portugal',
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
        name: 'Top Bike Tours Portugal',
        description:
          'Founded in 2013, Top Bike Tours Portugal, unipessoal, Lda referred to here in as "Top Bike Tours Portugal" is a company with experience in pedestrian and cycling tours in the city of Porto and long distance cycling routes to the north of the Iberian Peninsula and all around Portugal. Our activities are coordinated by tourism professionals, with a huge knowledge on heritage and sports.',
        short_name: 'Walking tours',
        theme_color: '#296a3f',
        background_color: '#fff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
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
    }),
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
    partytown({ config: { forward: ['dataLayer.push'], debug: true } })
  ],
  markdown: {
    rehypePlugins: [rehypeExternalLinks]
  },
  // redirects: convertJson(
  //   RouteData as {
  //     routes: {
  //       from: string;
  //       destination: string;
  //       status: ValidRedirectStatus;
  //     }[];
  //   }
  // ),
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
        default: 'https://topbiketoursportugal.com'
      }),
      INDEX: envField.string({
        context: 'client',
        access: 'public',
        default: 'false'
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
  //   '/[...path]': '/[...path]/'
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
