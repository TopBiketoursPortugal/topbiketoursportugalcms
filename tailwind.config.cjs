/** @type {import('tailwindcss').Config} */
// import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    plugins: [
      typographyPlugin,
      require('tailwindcss-animate'),
      plugin(({ addVariant }) => {
        addVariant('intersect', '&:not([no-intersect])');
      }),
      require('tailwindcss-signals'),
      require('tailwindcss-selector-patterns'),
      require('tailwindcss-mixins'),
      require('tailwindcss-multi')
    ],
    darkMode: [
      'class',
      ['selector', '[data-theme="dark"]'],
      ['selector', '[data-mode="dark"]'],
      [
        'variant',
        [
          '@media (prefers-color-scheme: dark) { &:not(.light *) }',
          '&:is(.dark *)'
        ]
      ]
    ]
    // darkMode: 'class'
  }
};
