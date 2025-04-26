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
import rehypeExternalLinks from 'rehype-external-links';
// import partytown from '@astrojs/partytown';
import type { RedirectConfig, ValidRedirectStatus } from 'astro';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const externalLinksConfig = {
  target: '_blank',
  rel: ['nofollow', 'noopener', 'noreferrer'],

  skip: (node: any) => {
    try {
      const url = node.properties?.href;
      return (
        typeof url === 'string' &&
        new URL(url).hostname === 'topbiketoursportugal.com'
      );
    } catch {
      return false;
    }
  }
};

function removeDuplicateRedirects(
  redirects: {
    from: string;
    destination: string;
    status: ValidRedirectStatus;
  }[]
) {
  const seen = new Set();
  const uniqueRedirects = [];

  for (const redirect of redirects) {
    const key = `${redirect.from}->${redirect.destination}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRedirects.push(redirect);
    }
  }
  return uniqueRedirects;
}

function convertJson(inputJson: {
  routes: { from: string; destination: string; status: ValidRedirectStatus }[];
}): Record<string, RedirectConfig> {
  const result = new Map<string, RedirectConfig>();

  removeDuplicateRedirects(inputJson.routes).forEach((route) => {
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
    {
      name: 'NetliflyRedirects',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const routeData = RouteData as {
            routes: {
              from: string;
              destination: string;
              status: ValidRedirectStatus;
            }[];
          };
          const redirectsRules = removeDuplicateRedirects(routeData.routes);
          const maxLength = Math.max(
            ...redirectsRules.map(({ from }) => from?.length ?? 0)
          );

          const textRedirects = removeDuplicateRedirects(routeData.routes)
            .map(
              ({ from, destination }) =>
                `${from.padEnd(maxLength, ' ')} ${destination}`
            )
            .join('\n');

          const redirectsPath = path.resolve('./dist', '_redirects');
          await writeFile(redirectsPath, textRedirects, 'utf8');

          console.log('✅ _redirects file generated after build!');
        }
      }
    },
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

    mdx({
      rehypePlugins: [[rehypeExternalLinks, externalLinksConfig]]
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
    //   short_name: 'TBTP',
    //   description: 'Top Bike Tours Portugal',
    //   start_url: '/',
    //   theme_color: '#ff7700',
    //   background_color: '#fff',
    //   display: 'standalone'
    // }),
    AstroPWA({
      mode: 'production',
      base: '/',
      scope: '/',
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: '/404/',
        // navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,png,avif,webp,jpg,ico}']
      },
      devOptions: {
        enabled: false
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
    sitemap({
      // filter: (page) => !redirects.has(page),
      i18n: {
        defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
        locales: {
          en: 'en-US', // The `defaultLocale` value must present in `locales` keys
          pt: 'pt-PT'
        }
      }
    })
    // partytown({ config: { forward: ['dataLayer.push'], debug: true } })
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, externalLinksConfig]]
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
    defaultStrategy: 'viewport'
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
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true
    }
  },
  trailingSlash: 'ignore',
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
  }
  // redirects: {
  //   '/[...path]': '/[...path]/'
  // }
  // vite: {
  // resolve: {
  //   alias: {
  //     '~': path.resolve('./src/') // Maps ~ to the src directory
  //   }
  // }
  //   css: {
  //     transformer: "lightningcss",
  //   },
  // plugins: [],
  // build: {
  //   //   // inlineStylesheets: 'never',
  //   rollupOptions: {
  //     external: ['astro:content-layer-deferred-module']
  //   }
  // }
  // }
});
