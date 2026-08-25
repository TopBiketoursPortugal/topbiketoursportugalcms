/**
 * ESM shim for the CJS `debug` package.
 *
 * astro-icon → @iconify/utils imports `debug`, which the Vite dev server
 * serves raw as CJS ("does not provide an export named 'default'") when the
 * import chain starts from client code — which happens for the editor-only
 * registerComponents bundle, killing ALL visual-editing registration in dev.
 * `debug` is only a namespaced logger, so a no-op with the same surface is
 * safe everywhere (aliased in astro.config.ts).
 */
function createDebug(namespace) {
  const log = () => {};
  log.namespace = namespace ?? '';
  log.enabled = false;
  log.color = '';
  log.diff = 0;
  log.log = () => {};
  log.extend = (suffix, delimiter = ':') =>
    createDebug(`${log.namespace}${delimiter}${suffix}`);
  log.destroy = () => true;
  return log;
}

createDebug.default = createDebug;
createDebug.coerce = (v) => v;
createDebug.disable = () => '';
createDebug.enable = () => {};
createDebug.enabled = () => false;
createDebug.humanize = (v) => String(v);
createDebug.log = () => {};
createDebug.selectColor = () => '';
createDebug.names = [];
createDebug.skips = [];
createDebug.formatters = {};

export default createDebug;
