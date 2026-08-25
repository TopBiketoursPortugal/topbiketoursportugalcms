/**
 * Moves cloudcannon.config.yml to the astro-component-starter approach:
 *  - removes the page-block entries that patch-config.mjs inlined into
 *    `_structures` (they now live as per-component
 *    *.cloudcannon.structure-value.yml files composed via glob)
 *  - keeps the tour/data structures (tour_packages, faqs, ...) inline
 *  - adds `_structures_from_glob` pointing at .cloudcannon/structures/
 *  - wires the `content_blocks` / `content_blocks_after` array inputs to the
 *    composed `_structures.content_blocks` picker
 */
import fs from 'fs/promises';
import yaml from 'yaml';

const CONFIG = 'cloudcannon.config.yml';

const BLOCK_KEYS = [
  'accordion',
  'primary',
  'secondary',
  'collection',
  'featured-posts',
  'featured-testimonials',
  'featured-tours',
  'features',
  'headline',
  'hero',
  'left-right',
  'text',
  'timeline',
  'tours',
  'two-column-markdown',
  'wetravel-button',
  'youtube'
];

const config = yaml.parse(await fs.readFile(CONFIG, 'utf8'));

let removed = 0;
for (const key of BLOCK_KEYS) {
  if (config._structures && key in config._structures) {
    delete config._structures[key];
    removed++;
  }
}

config._structures_from_glob = [
  '/.cloudcannon/structures/*.cloudcannon.structures.yml'
];

config._inputs ??= {};
config._inputs.content_blocks = {
  type: 'array',
  comment: 'The content blocks that make up this page.',
  options: {
    structures: '_structures.content_blocks'
  }
};
config._inputs.content_blocks_after = {
  type: 'array',
  comment: 'Content blocks rendered after the page body.',
  options: {
    structures: '_structures.content_blocks'
  }
};

await fs.writeFile(CONFIG, yaml.stringify(config), 'utf8');
console.log(
  `removed ${removed} inlined block structures; kept: ${Object.keys(config._structures ?? {}).join(', ')}`
);
