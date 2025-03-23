// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  trailingComma: 'none',
  arrowParens: 'always',
  endOfLine: 'auto',
  semi: true,
  printWidth: 80,
  singleQuote: true,
  quoteProps: 'consistent',
  proseWrap: 'always',
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-astro-organize-imports',
    'prettier-plugin-tailwindcss'
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  astroOrganizeImportsMode: 'All',
  tailwindAttributes: ['class:list', 'class'],
  tailwindFunctions: ['tv']
};
