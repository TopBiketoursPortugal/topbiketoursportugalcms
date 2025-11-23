import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import bookshop from '@bookshop/astro-bookshop';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import RouteData from './data/routing.json';
import rehypeExternalLinks, { type Options } from 'rehype-external-links';
import partytown from '@astrojs/partytown';
import type { ValidRedirectStatus } from 'astro';
import { writeFile } from 'fs/promises';
import path from 'path';

import { isInternalDomain } from './utils/domains';

const externalLinksConfig = {
  target: '_blank',
  rel: ['nofollow', 'noopener', 'noreferrer'],
  test: (node: any) => {
    try {
      const url = node.properties?.href;
      return typeof url === 'string' && !isInternalDomain(url);
    } catch {
      return false;
    }
  }
} satisfies Options;

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

// function convertJson(inputJson: {
//   routes: { from: string; destination: string; status: ValidRedirectStatus }[];
// }): Record<string, RedirectConfig> {
//   const result = new Map<string, RedirectConfig>();

//   removeDuplicateRedirects(inputJson.routes).forEach((route) => {
//     result.set(route.from, {
//       destination: route.destination,
//       status: route.status
//     });
//   });

//   return Object.fromEntries(result);
// }

// https://astro.build/config
export default defineConfig({
  site: 'https://topbiketoursportugal.com',
  integrations: [
    {
      name: 'NetliflyRedirects',
      hooks: {
        'astro:build:done': async ({ dir: _ }) => {
          const routeData = RouteData as {
            routes: {
              from: string;
              destination: string;
              status: ValidRedirectStatus;
            }[];
          };
          const redirectsRules = removeDuplicateRedirects(routeData.routes);
          const maxLength = Math.max(
            ...redirectsRules.map(
              ({ from }) => encodeURIComponent(from)?.length ?? 0
            )
          );

          const textRedirects = removeDuplicateRedirects(routeData.routes)
            .map(
              ({ from, destination }) =>
                `${from
                  .split('/')
                  .map((segement) => encodeURI(segement))
                  .join('/')
                  .padEnd(maxLength, ' ')} ${destination}`
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
    // svgs({
    //   input: [
    //     'src/assets/icons/ph/light',
    //     'src/assets/icons/ph/fill',
    //     'src/assets/icons/logos',
    //     'src/assets/icons/fa',
    //     'src/assets/icons/circle-flags'
    //   ]
    // }),

    mdx({
      rehypePlugins: [[rehypeExternalLinks, externalLinksConfig]]
    }),
    AstroPWA({
      mode: 'production',
      base: '/',
      scope: '/',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Top Bike Tours Portugal',
        short_name: 'TBTP',
        description: 'Top Bike Tours Portugal',
        theme_color: '#ff7700',
        background_color: '#fff',
        display: 'standalone',
        icons: [
          {
            src: '/favicon-16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/favicon-32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/favicon-16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/favicon-48.png',
            sizes: '48x48',
            type: 'image/png'
          }, {
            src: '/favicon-128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/favicon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,avif,ico}'],
      },
      devOptions: {
        enabled: false
      },
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
    }),
    partytown({ config: { forward: ['dataLayer.push'] } })
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
      GOOGLE_TAG_MANAGER_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'GTM-KRC3B4ZQ'
      }),
      GOOGLE_ANALYTICS_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '385531271'
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
        default: 'true'
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
  trailingSlash: 'always',

  experimental: {
    svgo: true,
    // csp: {
    //   // change the default algorithm
    //   algorithm: "SHA-512",
    //   // insert additional directives
    //   directives: [
    //     "default-src: 'self'",
    //   ],
    //   // add more information to the `style-src` directive
    //   styleDirective: {
    //     hashes: [
    //       "sha384-somehash" // hash generated for some external style e.g. white label, etc.
    //     ],
    //     // **Override** default resources
    //     resources: ["self"]
    //   },

    //   // add more information to the `style-src` directive
    //   scriptDirective: {
    //     hashes: [
    //       "sha384-somehash" // hash generated for some external script e.g. analytics, jQuery, etc.
    //     ],
    //     // **Override** default resources
    //     resources: ["self"],
    //     // Toggle the keyword `strict-dynamic`
    //     strictDynamic: true
    //   }
    // }
  },
  // image: {
  //   // Used for all Markdown images; not configurable per-image
  //   // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
  //   experimentalLayout: 'responsive'
  // },

  // redirects: {
  //   '/[...path]': '/[...path]/'
  // }
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(process.cwd(), 'src/assets/icons/used'),
        ],
        symbolId: '[name]'
      }) as Plugin
    ]
  }
});
