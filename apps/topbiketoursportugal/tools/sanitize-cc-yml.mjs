/**
 * Cleans Bookshop-era cruft and starter quirks out of the per-component
 * *.cloudcannon.inputs.yml / *.cloudcannon.structure-value.yml files so they
 * pass `npx @cloudcannon/cli validate`:
 *  - input defs: drop `default`/`required`/`example`, fold `description`
 *    into `comment`, move `syntax` under `options`, `type: boolean` → switch
 *  - `options` given as a bare array → `options: { values: [...] }`
 *  - numeric select values → `{ value, label }` objects (keeps stored type)
 *  - `options.format: null` → removed
 *  - `options.structures` given as an inline array → `{ values: [...] }`
 *  - icon names not in the Material Symbols enum → mapped/nearest fallback
 */
import fs from 'fs/promises';
import { glob } from 'node:fs/promises';
import yaml from 'yaml';

const ICON_MAP = {
  'smart_button': 'touch_app',
  'text': 'notes',
  'calendar': 'calendar_month',
  'message': 'chat',
  'eye-slash': 'visibility_off',
  'baseline-directions-bike': 'directions_bike',
  'hero': 'panorama',
  'help_outline': 'help',
  'people': 'groups',
  'columns': 'view_column',
  'video': 'smart_display'
};

function fixIcons(node) {
  if (Array.isArray(node)) {
    node.forEach(fixIcons);
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (typeof node.icon === 'string' && ICON_MAP[node.icon]) {
    node.icon = ICON_MAP[node.icon];
  }
  Object.values(node).forEach(fixIcons);
}

// Sanitize a map of { fieldName: inputDef }
function sanitizeInputsMap(inputs) {
  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) return;
  for (const def of Object.values(inputs)) {
    if (!def || typeof def !== 'object' || Array.isArray(def)) continue;

    if (def.description) {
      def.comment ??= def.description;
    }
    delete def.description;
    delete def.default;
    delete def.required;
    delete def.example;

    if (def.type === 'boolean') def.type = 'switch';

    if (def.syntax) {
      def.options = { ...(def.options ?? {}), syntax: def.syntax };
      delete def.syntax;
    }

    if (Array.isArray(def.options)) {
      def.options = { values: def.options };
    }

    if (def.options && typeof def.options === 'object') {
      if (def.options.format === null) delete def.options.format;
      if (Array.isArray(def.options.values)) {
        def.options.values = def.options.values.map((v) =>
          typeof v === 'number' ? { value: v, label: String(v) } : v
        );
      }
      if (Array.isArray(def.options.structures)) {
        def.options.structures = { values: def.options.structures };
      }
    }
  }
}

// Recursively find `_inputs` maps anywhere in the document (structure values
// nest them under _structures.*.values[*]._inputs etc.)
function walk(node) {
  if (Array.isArray(node)) {
    node.forEach(walk);
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (node._inputs) sanitizeInputsMap(node._inputs);
  Object.values(node).forEach(walk);
}

let changed = 0;
for await (const file of glob(
  'src/components/**/*.cloudcannon.{inputs,structure-value}.yml'
)) {
  const raw = await fs.readFile(file, 'utf8');
  const doc = yaml.parse(raw);
  if (doc == null) continue;

  if (file.endsWith('.inputs.yml')) {
    sanitizeInputsMap(doc);
  }
  walk(doc);
  fixIcons(doc);

  const out = yaml.stringify(doc);
  if (out !== raw) {
    await fs.writeFile(file, out, 'utf8');
    changed++;
    console.log(`sanitized: ${file}`);
  }
}
console.log(`${changed} files updated`);
