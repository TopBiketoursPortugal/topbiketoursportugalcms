/**
 * Auto-registers every component under src/components with CloudCannon's
 * editable-regions, keyed by kebab-cased path — collapsing the filename when
 * it matches its folder (hero/hero.astro → "hero",
 * page-sections/heroes/hero-split/HeroSplit.astro →
 * "page-sections/heroes/hero-split"). The exact same name scheme is used by
 * the renderers (src/shared/astro/page.astro and
 * src/components/utils/renderBlock.astro), so a block's `_component` value
 * resolves identically in production builds and in the Visual Editor.
 *
 * Only loaded inside the CloudCannon Visual Editor (see Layout.astro).
 */
import { registerAstroComponent } from '@cloudcannon/editable-regions/astro';
import '@cloudcannon/editable-regions/astro-react-renderer';
import { pascalToKebab } from '../components/utils/pascalToKebab';

const componentModules = import.meta.glob('../components/**/*.astro', {
  eager: true
});

for (const [path, module] of Object.entries(componentModules)) {
  const match = path.match(/\.\.\/components\/(.+)\.astro$/);
  if (!match) continue;

  const parts = match[1].split('/');
  const filename = parts[parts.length - 1];
  const parentFolder = parts.length > 1 ? parts[parts.length - 2] : null;
  const kebabFilename = pascalToKebab(filename);
  const kebabParent = parentFolder ? pascalToKebab(parentFolder) : null;

  const registrationPath =
    kebabFilename === kebabParent
      ? parts.slice(0, -1).join('/')
      : parts
          .slice(0, -1)
          .concat(kebabFilename)
          .join('/');

  registerAstroComponent(registrationPath, (module as any).default);
}
