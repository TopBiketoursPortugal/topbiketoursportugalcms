/**
 * Converts .cloudcannon/schemas/migrated-structures.json (the Bookshop
 * migration artifact) into the astro-component-starter "three-file pattern":
 * next to each component's .astro file it writes
 *   <name>.cloudcannon.inputs.yml          — content-field editor UI
 *   <name>.cloudcannon.structure-value.yml — picker metadata + default value
 * The structure-value pulls the inputs back in via _inputs_from_glob, and
 * .cloudcannon/structures/*.cloudcannon.structures.yml files compose all
 * structure-values via values_from_glob (assembled by CloudCannon, no codegen).
 *
 * Bookshop-era "bookshop:structure:buttons" placeholders become empty
 * defaults wired to _structures.buttons.
 */
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';

const SRC = '.cloudcannon/schemas/migrated-structures.json';

// migrated key → component directory (and thereby its `_component` name).
const DIRS = {
  accordion: 'src/components/accordion',
  primary: 'src/components/buttons/primary',
  secondary: 'src/components/buttons/secondary',
  collection: 'src/components/collection',
  'featured-posts': 'src/components/featured-posts',
  'featured-testimonials': 'src/components/featured-testimonials',
  'featured-tours': 'src/components/featured-tours',
  features: 'src/components/features',
  headline: 'src/components/headline',
  hero: 'src/components/hero',
  'left-right': 'src/components/left-right',
  text: 'src/components/text',
  timeline: 'src/components/timeline',
  'two-column-markdown': 'src/components/two-column-markdown',
  'wetravel-button': 'src/components/wetravel-button',
  youtube: 'src/components/youtube'
  // NOTE: the migrated "tours" entry is skipped on purpose — it is a collapsed
  // artifact of the tour-page/tour-card/... bookshop files, which render via
  // dedicated routes and are not generic content blocks.
};

const BUTTONS_PLACEHOLDER = 'bookshop:structure:buttons';

function componentName(dir) {
  return dir.replace('src/components/', '');
}

// Replace bookshop:structure:buttons placeholders; returns extra _inputs
// entries wiring those fields to _structures.buttons.
function fixButtonPlaceholders(value, extraInputs, prefix = '') {
  for (const [key, v] of Object.entries(value)) {
    const propPath = prefix ? `${prefix}.${key}` : key;
    if (v === BUTTONS_PLACEHOLDER) {
      value[key] = null;
      extraInputs[propPath] = {
        type: 'object',
        options: { structures: '_structures.buttons' }
      };
    } else if (Array.isArray(v) && v.includes(BUTTONS_PLACEHOLDER)) {
      value[key] = [];
      extraInputs[propPath] = {
        type: 'array',
        options: { structures: '_structures.buttons' }
      };
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      fixButtonPlaceholders(v, extraInputs, propPath);
    }
  }
}

const migrated = JSON.parse(await fs.readFile(SRC, 'utf8'));

for (const [key, entry] of Object.entries(migrated)) {
  const dir = DIRS[key];
  if (!dir) {
    console.log(`skip: ${key}`);
    continue;
  }
  const base = path.basename(dir);
  const name = componentName(dir);

  const { _type, ...blueprint } = entry.value ?? {};
  const value = { _component: name, ...blueprint };
  const extraInputs = {};
  fixButtonPlaceholders(value, extraInputs);

  const inputs = entry._inputs ?? {};
  const hasInputs = Object.keys(inputs).length > 0;

  const structureValue = {
    label: entry.label ?? base,
    icon: entry.icon ?? 'widgets',
    ...(entry.description ? { description: entry.description } : {}),
    value,
    preview: {
      text: [entry.label ?? base],
      icon: entry.icon ?? 'widgets'
    },
    picker_preview: {
      text: entry.label ?? base,
      ...(entry.description ? { subtext: entry.description } : {})
    },
    ...(hasInputs
      ? { _inputs_from_glob: [`/${dir}/${base}.cloudcannon.inputs.yml`] }
      : {}),
    ...(Object.keys(extraInputs).length ? { _inputs: extraInputs } : {})
  };

  if (hasInputs) {
    await fs.writeFile(
      path.join(dir, `${base}.cloudcannon.inputs.yml`),
      yaml.stringify(inputs),
      'utf8'
    );
  }
  await fs.writeFile(
    path.join(dir, `${base}.cloudcannon.structure-value.yml`),
    yaml.stringify(structureValue),
    'utf8'
  );
  console.log(`wrote: ${dir}/${base}.cloudcannon.{inputs,structure-value}.yml`);
}

console.log('done');
