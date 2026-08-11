// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '.netlify/**',
      '.jampack/**',
      'dev-dist/**',
      '.certs/**',
      'public/pagefind/**',
      'pnpm-lock.yaml'
    ]
  },

  // Baseline JS rules for every .js/.mjs/.cjs/.ts/.astro file.
  js.configs.recommended,

  // Type-aware-free TS rules (no `parserOptions.project`, so this stays fast
  // and doesn't require every .ts file to be included in a tsconfig).
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommended],
    rules: {
      // Helper/content-collection functions frequently accept args that
      // exist for callers rather than local use; only flag names that
      // don't opt out with a leading underscore.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },

  // Astro's recommended rules. This also auto-detects the locally installed
  // `@typescript-eslint/parser` (via `typescript-eslint` above) to parse the
  // TypeScript that lives in component frontmatter — without it every
  // `.astro` file using `interface Props`, `type` imports, `as` casts, etc.
  // fails to parse at all.
  ...eslintPluginAstro.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    }
  },

  // Astro frontmatter and plain JS/MJS helpers share the same convention as
  // the `.ts` block above — a leading underscore marks a binding that's
  // intentionally unused (most visibly the CloudCannon editable-region props
  // every building-block component destructures). `.ts` files are excluded
  // here since the block above already configures their (TS-aware) version
  // of this rule.
  {
    files: ['**/*.astro', '**/*.astro/*.js', '**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },

  // Core `no-undef` can't see TypeScript's ambient globals (e.g.
  // `ImageMetadata` from `astro/client`, the `astroHTML` namespace) and
  // reports them as undefined identifiers. `astro check`/`tsc` already catch
  // genuine undefined-reference bugs in these files with full type info.
  {
    files: ['**/*.ts', '**/*.astro', '**/*.astro/*.ts'],
    rules: {
      'no-undef': 'off'
    }
  },

  // Ambient .d.ts files can only pull in other ambient/global declarations
  // via triple-slash references — `import` isn't an alternative for them.
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  },

  // Formatting is Prettier's job (see lefthook.yml's separate `prettier`
  // pre-commit step) — just turn off the core/plugin rules that would
  // otherwise fight it, without re-running Prettier a second time as a lint
  // rule.
  eslintConfigPrettier
);
